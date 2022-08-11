import React, { useState, useEffect } from "react";

import { Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, } from '../UI';

export function ErrorBalance({amount, closeDialog}) {
    const [error, setError] = useState({});

    useEffect(() => {
    handleOpenBalance(amount)
    },[amount])

    const handleOpenBalance = (_amount) => {
        setError({
            open: _amount.open,
            value: _amount.value,
            unit: _amount.unit,
        })
    };

    return (
    <Dialog
        open={!!error.open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Insufficient funds
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                The total amount of {error.value} {error.unit} is more than the amount on your balance.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog} autoFocus>OK</Button>
        </DialogActions>
    </Dialog>
    );
}