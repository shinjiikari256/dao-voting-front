import React from 'react'

import { VotingsHeader } from '../components/Votings/VotingsHeader';
import { TableVotings } from '../components/Votings/Table/TableVotings';
import { Box } from '@mui/material';

export const VotingsPage = () => {
  return (
    <Box>
      <VotingsHeader/>
      <TableVotings/>
    </Box>
  )
}

export default VotingsPage
