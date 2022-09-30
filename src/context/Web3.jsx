import React, { createContext, useState, useRef } from 'react'

import { providers } from 'ethers'

const Web3Context = createContext({
  account: null,
  provider: null,
  network: null,
  networkError: null
})

const metamaskText = <span style={{textDecoration: 'underline'}}>Metamask</span>
const linkMetamask = <a href="https://metamask.io/" target="_blank">🦊 {metamaskText}</a>
const InstallMetamask = <span>Please install {linkMetamask}!</span>

const Web3Provider = ({children}) => {
  const { ethereum } = window;

  const getCurrentAccount = async () => (await ethereum.request({ method: 'eth_requestAccounts', }))[0]

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [network, setNetwork] = useState(null)

  const [ networkError, setNetworkError ] = useState(null)

  const _resetState = () => {
    setAccount(null)
    setNetworkError(null)
  }

  const connectWallet = async () => {
    if (ethereum === undefined) {
      setNetworkError(InstallMetamask)
      return
    }

    const selectedAddress = await getCurrentAccount()
    _initialize(selectedAddress)

    ethereum.on('accountsChanged', ([newAddress]) => {
      if (newAddress === undefined) {
        _resetState()
        return
      }

      _initialize(newAddress)
    })

    ethereum.on('chainChanged', (chainId) => {
      _resetState()
    })
  }

  const _initialize = async (selectedAddress) => {
    setAccount(() => selectedAddress)
    setProvider(() => new providers.Web3Provider(ethereum))
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