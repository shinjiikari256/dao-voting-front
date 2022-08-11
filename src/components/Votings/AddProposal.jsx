import React, { useState, useEffect, useContext } from "react";

import { Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Box, FormControlLabel, Switch
} from '../UI';

import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { VotingsContext } from "../../context/Votings"

const AddProposal = ({ctrl, closeDialog}) => {
  const { createVoting } = useContext(VotingsContext)
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(ctrl)
  },[ctrl])

  const notRequiredNumber = () => Yup.number().nullable(true)
      .notRequired()
      .transform((_, val) => val === Number(val) ? val : null)

  const numberRange = (name, min, max) => Yup.number()
      .transform((_, val) => Number(val))
      .min(min,`${name} must be between ${min} and ${max}.`)
      .max(max,`${name} must be between ${min} and ${max}.`)
      .nullable(true)
      .typeError(`${name} must be a number`)

  const durationValidate = (name, min, max) => Yup.number()
    .when('withDuration', {
      is: true,
      then: numberRange(name, min, max),
      otherwise: notRequiredNumber(),
    })

  const schema = Yup.object().shape({
    newFee: Yup.number()
      .required('Value is required.')
      .typeError('Value must be a number'),
    withDuration: Yup.boolean(),
    days: durationValidate('Days', 0, 599),
    hours: durationValidate('Hours', 0, 23),
    minutes: durationValidate('Minutes', 0, 59),
    seconds: durationValidate('Seconds', 0, 59),
  });

  const {
    register,
    formState: { errors, },
    handleSubmit,
    getValues,
    setValue,
    control,
    trigger,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  })

  let withDuration = useWatch({ control, name: "withDuration", });

  let update = ({target}) => {
    let value = target.type === 'checkbox' ? 'checked' : 'value'
    setValue(target.name, target[value],
      { shouldValidate: true }
    );
  }

  const getDuration = () => {
    const _sol = {
      day:     24 * 60 * 60,
      hour:         60 * 60,
      minute:            60,
      second:             1,
    }
    const [D, H, M, S] = getValues(['days', 'hours', 'minutes', 'seconds'])
          .map(v => v === undefined ? 0 : Number(v));
    console.log('getDuration:', [D, H, M, S]);
    const total = D * _sol.day + H * _sol.hour + M * _sol.minute + S * _sol.second;
    console.log('total:', total);
    return total;
  }

  const approveAmount = () => {
    const newFee = getValues('newFee')
    console.log('newFee:', newFee);
    const duration = withDuration && getDuration()
    createVoting(newFee, duration)
    closeDialog();
  };

  const NumberInput = ({name, label, ...props}) => {
    return (
      <TextField
          inputRef={register(name)}
          id={name}
          name={name}
          margin="normal"
          sx={{flexGrow: '1'}}
          label={label}
          onChange={update}
          placeholder="0"
          error={!!errors[name]}
          helperText={errors[name]?.message}
          {...props}
        />
    )
  }

  const DurationInput = ({label, ...props}) => {
    const name = label.toLowerCase();
    return NumberInput({name, label, disabled: !withDuration, ...props})
  }

  return (
    <Dialog open={!!open} onClose={closeDialog}>
      <DialogTitle>You can propose a new FEE value</DialogTitle>
      <DialogContent component="form">
        {NumberInput({name: "newFee", label: "New FEE", fullWidth: true})}

        <FormControlLabel
          control={
            <Switch
              name="withDuration"
              ref={register('withDuration')}
              inputProps={{ 'aria-label': 'controlled' }}
              defaultChecked={false}
              onChange={(evt) => { update(evt); trigger(['days', 'hours', 'minutes', 'seconds']) } }
            />
          }
          label="Set the duration"
          sx={{flexGrow: '0'}}
        />
        <Box fullWidth  sx={{ display: 'flex', flexJustify: 'center', gap: 2 }}>

          {DurationInput({label: "Days"})}
          {DurationInput({label: "Hours"})}
          {DurationInput({label: "Minutes"})}
          {DurationInput({label: "Seconds"})}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleSubmit(approveAmount)}>Propose</Button>
      </DialogActions>
    </Dialog>
  );
}

export { AddProposal }