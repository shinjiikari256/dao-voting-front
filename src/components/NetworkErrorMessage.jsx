import React, { useContext } from "react";

import { Collapse, Alert, IconButton,CloseIcon } from './UI';

import { Web3Context } from '../context/Web3'

export const NetworkErrorMessage = () => {
  const { networkError, dismissNetworkError } = useContext(Web3Context)
  return (
    <>
      {networkError && (
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={dismissNetworkError}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
              }
            sx={{ mt: 2 }}
            severity="error"
          >
            {networkError}
          </Alert>
      )}
    </>
  )
}

export default NetworkErrorMessage;