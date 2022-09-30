import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

import { ethers, BigNumber as BN } from "ethers"

import tokenInfo from '../../contracts/LazyGolos.json'

import { Web3Context } from "./Web3"

import { handlerError, NET_NAME } from './common'

const TokenContext = createContext({
  access: null
})

const TokenProvider = ({children}) => {
  const { provider, account } = useContext(Web3Context)

  let [tokens, setTokens] = useState(null);

  let [access, setAccess] = useState({
    isMember: false,
    isInfluential: false,
  });

  const startBlockNumberRef = useRef(0);
  const startBlockNumber = () => startBlockNumberRef?.current;
  const updateBlockNumber = async () => (
    startBlockNumberRef.current = await provider?.getBlockNumber()
  );

  const updateContract = () => {
    const contract = new ethers.Contract(
      tokenInfo.addresses[NET_NAME],
      tokenInfo.abi,
      provider.getSigner(0)
    );
    setTokens(contract);
    return contract
  }

  const isNew = (event) => event.blockNumber > startBlockNumber()

  const withThisAccount = (from, to) =>
    from.toLowerCase() === account.toLowerCase() ||
      to.toLowerCase() === account.toLowerCase()

  const transferEvent = (from, to, value, event) =>
    isNew(event) && withThisAccount(from, to) &&
    (async () => await checkAccess(tokens))();

  const claim = () => {
    if (!tokens) return;
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

  const resubscribeOnEvents = (oldToken, newToken) => {
    const eventsCallbacks = {
      'Transfer': transferEvent,
    }
    for (let event in eventsCallbacks)
      oldToken?.off(event, eventsCallbacks[event]);
    (async () => await updateBlockNumber())();
    for (let event in eventsCallbacks)
      newToken?.on(event, eventsCallbacks[event]);
  }

  const checkAccess = async (_tokens) => {
    if (!_tokens) return;
    const balance = await _tokens.balanceOf(account);
    const total = await _tokens.totalSupply();

    const isMember = balance.gt(BN.from(0));
    const isInfluential = isMember && total.div(balance).lte(BN.from(10));

    setAccess(({ isMember, isInfluential }))
  }

  useEffect(() => {
    if (!provider) return;
    const newTokens = updateContract();
    (async () => await checkAccess(newTokens))();
    resubscribeOnEvents(tokens, newTokens);
  }, [provider])

  useEffect(() => {
    resubscribeOnEvents(tokens, tokens);
  }, [access])

  return (
    <TokenContext.Provider
      value={{
        access,
        getBalance,
        claim
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export { TokenContext, TokenProvider }