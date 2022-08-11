import React, { useContext } from "react";

import { Button } from './UI';

import { Web3Context } from '../context/Web3'
import { blue } from "@mui/material/colors";

const connectWalletStyles = {
  width: '180px',
  height: '40px',
  borderRadius: '24px',
  bgcolor: 'white',
  color: blue[600],
  '&:hover': {
    bgcolor: blue[400],
    color: 'white',
  },
}

export const ConnectWallet = () => {
  const { connectWallet } = useContext(Web3Context)

  return (
      <Button
        variant="contained"
        onClick={connectWallet}
        sx={connectWalletStyles}
      >
        Connect wallet!
      </Button>
  )
}

export default ConnectWallet;