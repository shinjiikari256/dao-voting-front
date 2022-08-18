import React, { useContext, useState } from 'react';

import {
  Box,
  Chip,
  Typography,
  DoneIcon,
  AddIcon,
} from '../UI';

import { AddProposal } from './AddProposal'

import { VotingsContext } from "../../context/Votings"
import { TokenContext } from "../../context/VotesToken"

export const VotingsHeader = () => {
  const { fee, summarizing, haveEnded } = useContext(VotingsContext)
  const { access: { isInfluential } } = useContext(TokenContext)

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
          disabled={!haveEnded}
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

      {openProposal &&
        <AddProposal closeDialog={handleClose}/>
      }
    </>
  )
}

export default VotingsHeader

