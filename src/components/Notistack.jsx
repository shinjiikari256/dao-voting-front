import React, { useState, useEffect } from "react"

import { SnackbarProvider, useSnackbar } from 'notistack'

function Snackbar({newMessage}) {
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
      if (!newMessage?.msg) return
      enqueueSnackbar(newMessage.msg)
      console.log(newMessage.msg)
    }, [newMessage])

    return (<></>)
  }

export function Notistack({newEvent}) {
    const [ newMessage, setNewMessage ] = useState({})

    useEffect(() => {
      if (!newEvent?.block) return
      setNewMessage({
        msg: `(${newEvent.block}) massSend: [${newEvent.amount}] --> ${newEvent.to}`
      })
    }, [newEvent.block, newEvent.to])

    return (
      <SnackbarProvider
        maxSnack={7}
        sx={{ width: '600px' }}
        autoHideDuration="12000"
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
          <Snackbar newMessage={newMessage}/>
      </SnackbarProvider>
    )
  }