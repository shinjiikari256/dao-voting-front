import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

import { ethers, BigNumber as BN } from "ethers"

import { VotingMachine as engineAddress } from '../../contracts/VotingMachine-contract-address.json'
import { abi as engineArtifact } from '../../contracts/VotingMachine.json'

import { DEFI as defiAddress } from '../../contracts/DEFI-contract-address.json'
import { abi as defiArtifact } from '../../contracts/DEFI.json'

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

  let [ haveEnded, setHaveEnded ] = useState(false);

  const startBlockNumberRef = useRef(0);
  const startBlockNumber = () => startBlockNumberRef?.current;
  const updateBlockNumber = async () => (
    startBlockNumberRef.current = await provider?.getBlockNumber()
  );

  const timersRef = useRef({});
  const timers = () => timersRef?.current;
  const addTimer = (id, sec) => (
    timersRef.current = { ...timersRef.current, [id]: setTimeout(() => {
      setHaveEnded(true);
      console.log('ended:', id);
      clearTimer(id);
    }, sec)}
  );
  const clearTimer = (id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  };
  const clearTimers = () => {
    const _timers = timers()
    for (let id in _timers) {
      clearTimeout(_timers[id]);
    }
    timersRef.current = {}
  };

  window.timers = timers;

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

  const updateList = (newVotings) => {
    const now = Date.now();
    const { id, deadline } = newVotings;
    addTimer(id, deadline * 1000 - now);
    setList([ newVotings, ...list ])
  }

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

  const summarizing = () => {
    if (!engine) return;
    engine.summarizingAll();
    setHaveEnded(false);
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

  const checkEnded = async (_engine) => {
    const openedId = (await _engine.actualVotings()).slice(1);
    if (openedId.length === 0) return;

    const now = Date.now() / 1000;
    const opened = list.filter(({id}) => openedId.includes(id));
    let ended = opened.some(({deadline})=> deadline <= now);
    setHaveEnded(ended);

    let actual = opened.filter(({deadline})=> deadline > now);
    const _now = Date.now();
    actual.forEach(({id, deadline}) => {
      console.log('create timer:', id, deadline * 1000 - _now)
      timers[id] || addTimer(id, deadline * 1000 - _now);
    });
  }

  const updateFee = async (_defi) => setFee((await _defi.FEE()).toNumber())

  useEffect(() => () => {
    clearTimers()
  }, [])

  const updateFillData = async (_engine, _defi) => {
    await updateFee(_defi)
    await uploadList(_engine)
    await checkEnded(_engine)
  }

  useEffect(() => {
    if (!provider) return;

    const newDefi = updateContract('defi');
    const newEngine = updateContract('engine');

    (async () => await updateFillData(newEngine, newDefi))();

    resubscribeOnEvents(engine, newEngine);
  }, [provider])

  useEffect(() => {
    resubscribeOnEvents(engine, engine)
  }, [list])

  useEffect(() => {
    if (!engine) return;
    (async () => await checkEnded(engine))();
  }, [haveEnded])

  return (
    <VotingsContext.Provider
      value={{
        fee,
        haveEnded,
        votingsList: list,
        createVoting,
        vote,
        summarizing,
      }}
    >
      {children}
    </VotingsContext.Provider>
  )
}

export { VotingsContext, VotingsProvider }