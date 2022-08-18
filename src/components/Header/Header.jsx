import React, { useContext } from 'react'

import { Web3Context } from '../../context/Web3'
import { ConnectWallet } from '../ConnectWallet'

import { Link } from 'react-router-dom';

import s from './Header.module.css';
import Account from './Account';

const Header = () => {
  const { account } = useContext(Web3Context)

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.wrapper}>
          <Link to="/">Votings</Link>
        </div>
        <div className={s.wrapper}>
          <Link to="/claim">Claim</Link>
        </div>
        <div className={s.wrapper}>
          {account ? (
              <Account>{account}</Account>
            ) : (
              <ConnectWallet color='primary.dark'/>
            )
          }
        </div>
      </div>
    </header>
  )
}

export { Header }
