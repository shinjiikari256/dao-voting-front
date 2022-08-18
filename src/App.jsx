import React, { useContext } from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from './components/Header/Header';
import { NetworkErrorMessage } from './components/NetworkErrorMessage';

import ClaimPage from './pages/ClaimPage';
import VotingsPage from './pages/VotingsPage';

import { Web3Context } from './context/Web3'
import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';

export default function(props) {
  const { account } = useContext(Web3Context)

  return (
    <Box sx={{ backgroundColor: blue[50] }}>
      <Router>
        <Header />
        <div className="main bg-secondary">
          <NetworkErrorMessage />
          {account && (
              <Routes>
                <Route path="/" element={ <VotingsPage /> } />
                <Route path="/claim" element={ <ClaimPage/> } />
              </Routes>
          )}
        </div>
      </Router>
    </Box>
  )
}