import React, { useContext } from 'react'

import { Web3Context } from '../../context/Web3'
import { ConnectWallet } from '../ConnectWallet'

import { Link } from 'react-router-dom';

import s from './Header.module.css';
import Account from './Account';

const pages = [
  { id: 'auction',title: 'Auction', link: '/' },
  { id: 'voting',title: 'Votings', link: '/votings' },
  { id: 'claim',title: 'Claim',   link: '/claim' },
]

const NavItem = ({ id, title, link }) => (
  <div key={id} className={s.wrapper}>
    <Link to={link}>{title}</Link>
  </div>
)

const Header = () => {
  const { account } = useContext(Web3Context)

  return (
    <header className={s.header}>
      <div className={s.container}>
        { pages.map(NavItem) }
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
