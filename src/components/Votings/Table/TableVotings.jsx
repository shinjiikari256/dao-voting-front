import React, { useContext, useState } from 'react';

import TableRowVote from './TableRowVote'

import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '../../UI';


import { VotingsContext } from "../../../context/Votings"

const SizeCols = ({sizes}) => {
  const sum = sizes.reduce((acc, w) => acc + w, 0)
  const pers = sizes.map((w) => Math.round(w * 100 / sum ))
  return (
    <colgroup>
      {pers.map((w, index) => <col key={index} width={`${w}%`}/>)}
    </colgroup>
  )
}

//

const TableVotings = () => {
  const { votingsList: rows } = useContext(VotingsContext)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => { setPage(newPage); };

  const handleChangeRowsPerPage = ({target}) => {
    setRowsPerPage(parseInt(target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 && Math.max(0, (1 + page) * rowsPerPage - rows?.length);

  return (
    <Box sx={{ padding: '20px 0' }}>
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 50px - 3*20px - 32px)' }}>
        <Table component='table' stickyHeader sx={{ minWidth: 650}} aria-label="simple table">
        <SizeCols sizes={[1, 2, 1, 1, 2, 1, 1]} />
          <TableHead component='thead'>
            <TableRow>
              <TableCell align="center">FEE</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center" colSpan={2}>Reject</TableCell>
              <TableCell/>
              <TableCell align="center" colSpan={2}>Approve</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component='tbody'>
            {rows?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((voting) => (
                    <TableRowVote
                      key={`voting-row-${voting.id}`}
                      voting={voting}
                    />))}
              {emptyRows > 0 && (
                <TableRow key='empty' height={81 * emptyRows}>
                  <TableCell colSpan='100%' />
                </TableRow>
              )}
          </TableBody>
        </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </TableContainer>
    </Box>
  );
}

// export default TableVotings
export { TableVotings }