import React from 'react'

import { VotingsHeader } from '../components/Votings/VotingsHeader';
import { TableVotings } from '../components/Votings/Table/TableVotings';
import { Box } from '@mui/material';

import { VotingsProvider } from '../context/Votings';

export const VotingsPage = () => {
  return (
    <VotingsProvider>
      <Box>
        <VotingsHeader/>
        <TableVotings/>
      </Box>
    </VotingsProvider>
  )
}

export default VotingsPage
