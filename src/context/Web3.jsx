import React, { createContext, useState, useRef } from 'react'

import { providers } from 'ethers'

const Web3Context = createContext({
  account: null,
  provider: null,
  network: null,
  networkError: null
})

const Web3Provider = ({children}) => {
  const { ethereum } = window;

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [network, setNetwork] = useState(null)

  const [ networkError, setNetworkError ] = useState(null)

  const _resetState = () => {
    setAccount(null)
    setNetworkError(null)
  }

  const linkMetamask = <a href="https://metamask.io/" target="_blank" style={{textDecoration: 'underline'}}>Metamask!</a>
  const installMetamask = <span>Please install {linkMetamask}</span>

  const connectWallet = async () => {
    if (ethereum === undefined) {
      setNetworkError(installMetamask)
      return
    }

    const [ selectedAddress ] = await ethereum.request({
      method: 'eth_requestAccounts',
    })

    _initialize(selectedAddress)

    ethereum.on('accountsChanged', ([newAddress]) => {
      if (newAddress === undefined) {
        _resetState()
        return
      }

      _initialize(newAddress)
    })

    ethereum.on('chainChanged', ([networkId]) => {
      _resetState()
    })
  }

  const _initialize = async (selectedAddress) => {
    setProvider(new providers.Web3Provider(ethereum))
    setAccount(selectedAddress)
  }

  const dismissNetworkError = () => {
    setNetworkError(null)
  }

  return (
    <Web3Context.Provider
      value={{
        provider,
        account,
        network,
        networkError,
        connectWallet,
        dismissNetworkError
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export { Web3Context, Web3Provider }