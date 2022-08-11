import { Avatar } from '@mui/material'
import { blue } from '@mui/material/colors';
import React from 'react'

import s from './Header.module.css'

const Account = ({children}) => {
  const trim = (user) => user
    .replace(/^(0x[0-9a-fA-F]{4})[0-9a-fA-F]+([0-9a-fA-F]{4})/, '$1...$2');

  return (
    <div className={`${s.account} ${s.badge}`}>
      {trim(children)}
      <Avatar sx={{ width: 24, height: 24, bgcolor: blue[600] }} color='primary'/>
    </div>
  )
}

export default Account