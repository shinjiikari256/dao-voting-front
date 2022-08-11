import React from 'react'
import ReactDOM from 'react-dom'
import './globals.css'

import 'typeface-roboto';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

import { Web3Provider } from './context/Web3'

import { VotingsProvider } from './context/Votings';
import App from './App'

const theme = createTheme({
  palette: {
    success: {
      main: '#87b41d',
    },
    error: {
      main: '#fb8b23',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: blue[50],
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: blue[700],
            minHeight: 24,
            border: "2px solid" + blue[50],
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: blue[400],
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: blue[400],
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: blue[400],
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: blue[400],
          },
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <VotingsProvider>
          <App />
        </VotingsProvider>
      </Web3Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
