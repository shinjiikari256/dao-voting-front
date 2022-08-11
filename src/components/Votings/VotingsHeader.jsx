import React, { useContext, useState } from 'react';

import {
  Box,
  Chip,
  Typography
} from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';

import { AddProposal } from './AddProposal'

import { VotingsContext } from "../../context/Votings"

export const VotingsHeader = () => {
  const { fee, summarizing, access: { isChairman, isInfluential } } = useContext(VotingsContext)

  const [openProposal, openModalProposal] = useState(false)

  const handleOpen = () => { openModalProposal(true) }
  const handleClose = () => { openModalProposal(false) }

  const VotingsChip = ({label, ...args}) => (
    <Chip
      label={<Typography>{label}</Typography>}
      color="primary"
      sx={{width: '20%'}}
      {...args}
    />
  )

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <VotingsChip
          label='Summarizing'
          icon={ <DoneIcon /> }
          disabled={!isChairman}
          onClick={summarizing}
        />

        <VotingsChip
          label={`FEE: ${fee}`}
        />

        <VotingsChip
          label='Create voting'
          icon={ <AddIcon /> }
          disabled={!isInfluential}
          onClick={handleOpen}
        />
      </Box>

      <AddProposal ctrl={openProposal} closeDialog={handleClose}/>
    </>
  )
}

export default VotingsHeader

