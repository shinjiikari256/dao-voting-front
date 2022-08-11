import React, { useContext, useMemo, useState, useEffect } from 'react'

import {
  TableCell,
  TableRow,
  IconButton,
  Typography,
  ProgressLabel,
  BorderLinearProgress
} from '../../UI';

import {
  ThumbUpIcon,
  ThumbDownIcon,
} from '../../UI';

const VoteProgress = ({yes, no}) => (
  <BorderLinearProgress
    variant="determinate"
    value={Math.round((no / (yes + no)) * 100)}
    className={!(yes || no) && 'no-vote'}
  />
)

const VoleLabel = ({yes = 0, no = 0}) => (
  <ProgressLabel className={yes > 0 && 'yes' || no > 0 && 'no'}>
    {yes || no}
  </ProgressLabel>
)

const ApproveButton = ({onClick, disabled}) => (
  <IconButton disabled={disabled} color="success" onClick={onClick}> <ThumbUpIcon/> </IconButton>
);

const RejectButton = ({onClick, disabled}) => (
  <IconButton disabled={disabled} color="error" onClick={onClick}> <ThumbDownIcon/> </IconButton>
);

// const DateTime = ({deadline}) => {
//   const dateTime = new Date(deadline * 1000)
//   const [ date, time ] = dateTime.toLocaleString().split(', ')

//   return (<>
//       <Typography>{date}</Typography>
//       <Typography>{time}</Typography>
//     </>)
// }

const DateTime = ({deadline}) => {
  if ( deadline == 0 ) return <>
    <Typography/>
    <Typography/>
  </>

  let days = Math.floor(deadline / (24*60*60*1000));
  const formatDays = (d) => [ ` `, `${d} day` ][d] || `${d} days`;
  console.log()
  const time = new Date(deadline).toLocaleTimeString('en-GB', {
    timeZone:'Etc/UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (<>
      <Typography>{formatDays(days)}</Typography>
      <Typography>{time}</Typography>
    </>)
}

import { VotingsContext } from "../../../context/Votings"

const TableRowVoteView = ({ voting: { fee, leftTime, yes, no }, vote, disabled }) => (
  <TableRow>
    <TableCell align="center" component="th" scope="row">
      <Typography>{fee}</Typography>
    </TableCell>

    <TableCell align="center">
      <DateTime deadline={leftTime} />
    </TableCell>

    <TableCell align="center">
      <RejectButton onClick={() => vote(false)} disabled={disabled} />
    </TableCell>

    <TableCell align="right">
      <VoleLabel no={no}/>
    </TableCell>

    <TableCell align="center" width='200px'>
      <VoteProgress yes={yes} no={no}/>
    </TableCell>

    <TableCell align="left">
      <VoleLabel yes={yes}/>
    </TableCell>

    <TableCell align="center">
      <ApproveButton onClick={() => vote(true)} disabled={disabled}/>
    </TableCell>
  </TableRow>
)

const TableRowVote = ({ voting: {id, fee, deadline, yes, no} }) => {
  const { vote, access: { isMember } } = useContext(VotingsContext)
  const unixDeadline = useMemo(() => deadline * 1000);
  const leftTime = () => unixDeadline - Date.now() > 0 ? unixDeadline - Date.now() : 0
  const [ isEnd, setIsEnd ] = useState(leftTime() <= 0)
  const [ left, setLeft ] = useState(leftTime())
  // let timeout
  let tick

  useEffect(() => {
    if (leftTime() == 0)
      return clearInterval(tick);
    tick = setInterval(() => {
      setLeft(() => leftTime());
      setIsEnd(() => leftTime() <= 0)
    }, 1000)
  }, []);

  return (
    <TableRowVoteView
      voting={{fee, leftTime: left, yes, no}}
      disabled={isEnd || !isMember}
      vote={vote(id)}
    />
  )
}

export default TableRowVote


