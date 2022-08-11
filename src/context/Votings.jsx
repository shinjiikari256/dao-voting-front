import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

import { ethers, BigNumber as BN } from "ethers"

import { VotingMachine as engineAddress } from '../../contracts/VotingMachine-contract-address.json'
import { abi as engineArtifact } from '../../contracts/VotingMachine.json'

import { DEFI as defiAddress } from '../../contracts/DEFI-contract-address.json'
import { abi as defiArtifact } from '../../contracts/DEFI.json'

import { LazyGolos as tokensAddress } from '../../contracts/LazyGolos-contract-address.json'
import { abi as tokensArtifact } from '../../contracts/LazyGolos.json'

import { Web3Context } from "./Web3"

const ERROR_CODE_TX_REJECTED_BY_USER = 4001

const handlerError = (err) => {
  if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER)
    console.error(err ?.data ?.message ?? err ?.message)
}

const VotingsContext = createContext({
  fee: 0,
  engine: null,
  votingsList: [],
})

const VotingsProvider = ({children}) => {
  const { provider, account } = useContext(Web3Context)

  let [engine, setEngine] = useState(null);
  let [list, setList] = useState([]);

  let [defi, setDefi] = useState(null);
  let [fee, setFee] = useState(0);

  let [tokens, setTokens] = useState(null);

  let [ access, setAccess ] = useState({
    isMember: false,
    isInfluential: false,
    isChairman: false,
  });

  const startBlockNumberRef = useRef(0);
  const startBlockNumber = () => startBlockNumberRef?.current;
  const updateBlockNumber = async () => (
    startBlockNumberRef.current = await provider?.getBlockNumber()
  );
  const createData = (id, fee, deadline, yes = BN.from(0), no = BN.from(0)) => ({
    id,
    fee: fee.toNumber(),
    deadline: deadline.toNumber(),
    yes: yes.toNumber(),
    no: no.toNumber()
  })

  const contracts = {
    'defi':   { set: setDefi  , address: defiAddress,   abi: defiArtifact   },
    'engine': { set: setEngine, address: engineAddress, abi: engineArtifact },
    'tokens': { set: setTokens, address: tokensAddress, abi: tokensArtifact },
  }

  const updateContract = (name) => {
    if (!contracts[name]) return null;
    const {set, address, abi} = contracts[name];
    const contract = new ethers.Contract(address, abi, provider.getSigner(0));
    set(contract);
    return contract
  }

  const uploadList = async (_engine) => {
    if (!_engine) return;
    await updateBlockNumber()
    console.time('getAllVotings')
    const votedEvents = await _engine.queryFilter('UpdateVote')
    const createEvents = await _engine.queryFilter('CreatedVoting')

    const lastVotes = (acc, {args: {id, yes, no}}) => ({...acc, [id]: {yes, no}})
    const votes = votedEvents.reduce(lastVotes, {})

    const votings = createEvents
      .map(({args: {id, fee, endTime}}) =>
        createData(id, fee, endTime, votes[id]?.yes, votes[id]?.no))
      .reverse()

    console.timeEnd('getAllVotings')

    console.log(votings);
    setList(votings)
    return votings
  }

  const updateList = (newVotings) => setList([ newVotings, ...list ])

  const updateVote = (id, yes, no) =>
    setList([...list].map((v) => v.id == id ? ({...v, yes, no}) : v))

  const isNew = (event) => event.blockNumber > startBlockNumber()

  const createdVotingEvent = (id, initiator, fee, startTime, endTime, event) =>
    isNew(event) && updateList(createData(id, fee, endTime))

  const updateVoteEvent = (id, yes, no, event) =>
    isNew(event) && updateVote(id, yes.toNumber(), no.toNumber())

  const summarizingEvent = (id, fee, yes, no, event) =>
    isNew(event) && yes.gt(no) &&
      (async () => await updateFee(defi))();

  const createVoting = (fee, duration = 0) => {
    duration
    ? engine['createVoting(uint256,uint256)'](fee, duration)
    : engine['createVoting(uint256)'](fee)
  }

  const vote = (id) => (isAgree) => engine?.vote(id, isAgree)

  const summarizing = () => engine?.summarizingAll()

  const balanceOf = (address) => tokens.balanceOf(address)

  const claim = () => {
    try {
      tokens.claim();
    } catch (err) {
      handlerError(err)
    }
  }

  const format = (balance, dec = 0) => {
    const str = balance.toString()
    if (dec === 0) return str
    const zeros = '0'.repeat(Math.max(dec + 1 - str.length, 0))
    const regexp = new RegExp(`(\\d*)(\\d{${dec}})`)
    return (zeros + str).replace(regexp, `$1.$2`)
  };

  const getBalance = async (address) => {
    if (!tokens) return 0
    try {
      const _decimals = await tokens.decimals();
      const _balance = await tokens.balanceOf(address || account)
      return format(_balance, _decimals);
    } catch (err) {
      handlerError(err)
    }
    return 0
  }

  const resubscribeOnEvents = (oldEngine, newEngine) => {
    const eventsCallbacks = {
      'CreatedVoting': createdVotingEvent,
      'UpdateVote': updateVoteEvent,
      'SummarizedVoting': summarizingEvent
    }
    for (let event in eventsCallbacks)
      oldEngine?.off(event, eventsCallbacks[event]);
    (async () => await updateBlockNumber())();
    for (let event in eventsCallbacks)
      newEngine?.on(event, eventsCallbacks[event]);
  }

  const checkAccess = async (_engine, _tokens) => {
    const balance = await _tokens.balanceOf(account);
    const total = await _tokens.totalSupply();
    const owner = await engine.owner();

    const isMember = balance.gt(BN.from(0));
    const isInfluential = isMember && total.div(balance).lte(BN.from(10));
    const isChairman = account.toLowerCase() == owner.toLowerCase();

    setAccess(() => ({ isMember, isInfluential, isChairman, }))
  }

  const updateFee = async (_defi) => setFee((await _defi.FEE()).toNumber())

  useEffect(() => {
    if (!provider) return;

    const newDefi = updateContract('defi');
    const newEngine = updateContract('engine');
    const newTokens = updateContract('tokens');

    (async () => {
      await updateFee(newDefi)
      await uploadList(newEngine)
    })();

    resubscribeOnEvents(engine, newEngine);
  }, [provider])

  useEffect(() => {
    (async () => await checkAccess(engine, tokens))();
    resubscribeOnEvents(engine, engine)
  }, [list])

  return (
    <VotingsContext.Provider
      value={{
        fee,
        access,
        votingsList: list,
        createVoting,
        vote,
        summarizing,
        getBalance,
        claim
      }}
    >
      {children}
    </VotingsContext.Provider>
  )
}

export { VotingsContext, VotingsProvider }