import React, { useState, useContext } from "react"

import { Box, Button, TextField } from './UI';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Web3Context } from "../context/Web3"
import { VotingsContext } from "../context/Votings"
import { Paper } from "@mui/material";

export const Claim = () => {
  const { account } = useContext(Web3Context)
  const { getBalance, claim } = useContext(VotingsContext)

  const ADDRESS = '0x[0-9a-f]{40}';

  const schema = Yup.object().shape({
    accountAddress: Yup.string().nullable(true).trim()
      .notRequired()
      .matches(new RegExp(`(^${ADDRESS}$|^$)`, 'i'), 'The address must starts with 0x and be 40 hex chars.')
  });

  let initialState = {
    accountAddress: null,
  };

  const {
    register,
    formState: { errors, },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: initialState,
  })

  let update = ({ target }) => {
    const value = target.type === 'checkbox' ? 'checked' : 'value'
    setValue(target.name, target[value],
      { shouldValidate: true }
    );
  }

  const [balance, setBalance] = useState(0)

  const updateBalance = async () =>
    setBalance(await getBalance(getValues('accountAddress')))

  return (
    <Paper sx={{ padding: 2, }} >
      <Box
        fullWidth
        sx={{
          display: 'flex',
          flexJustify: 'center',
          alignItems: 'center',
          marginBottom: 2,
          gap: 2,
        }}
      >
        <TextField
          id="accountAddress"
          name="accountAddress"
          inputRef={register('accountAddress')}
          fullWidth
          label="Account address"
          placeholder={account}
          onChange={update}
          error={!!errors.accountAddress}
          helperText={errors ?.accountAddress ?.message}
          sx={{ flexGrow: '1' }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit(updateBalance)}
        >
          Get token balance
        </Button>

        <TextField
          id="accountBalance"
          name="accountBalance"
          sx={{ flexGrow: '0' }}
          label="Account balance"
          readOnly
          value={balance}
        />
      </Box>

      <Button fullWidth variant="contained" onClick={claim}>
        Claim
      </Button>
    </Paper>
  )
}

export default Claim;