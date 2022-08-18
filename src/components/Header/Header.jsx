import React, { useContext } from 'react'

// import {
//   Box, Container,
//   AppBar, Toolbar, Menu,
//   Button, IconButton,
//   Typography,
//   Avatar,
//   Tooltip,
//   MenuItem,
// } from '@mui/material';

// import AdbIcon from '@mui/icons-material/Adb';
// import MenuIcon from '@mui/icons-material/Menu';

import { Web3Context } from '../../context/Web3'
import { ConnectWallet } from '../ConnectWallet'

import { Link } from 'react-router-dom';

import s from './Header.module.css';
import Account from './Account';

const Header = () => {
  const { account } = useContext(Web3Context)

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.wrapper}>
          <Link to="/">Votings</Link>
        </div>
        <div className={s.wrapper}>
          <Link to="/claim">Claim</Link>
        </div>
        <div className={s.wrapper}>
          {account ? (
              <Account>{account}</Account>
            ) : (
              <ConnectWallet color='primary.dark'/>
            )
          }
        </div>
      </div>
    </header>
  )
}

export { Header }

// const pages = ['Votings', 'Claim'];
// const targets = {
//   'Votings': '/',
//   'Claim': '/claim'
// };
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// const ResponsiveAppBar = () => {
//   const [anchorElNav, setAnchorElNav] = React.useState(null);
//   const [anchorElUser, setAnchorElUser] = React.useState(null);

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   const Logo = ({display}) => (
//     <>
//       <AdbIcon sx={{ display: 'flex', mr: 1 }} />
//       <Typography
//         variant="h5"
//         noWrap
//         component="a"
//         sx={{
//           mr: 2,
//           display: 'flex',
//           flexGrow: 1,
//           fontFamily: 'monospace',
//           fontWeight: 700,
//           letterSpacing: '.3rem',
//           color: 'inherit',
//           textDecoration: 'none',
//         }}
//       >
//         <Link to="/">LOGO</Link>
//       </Typography>
//     </>
//   )

//   const BarAvatar = () => (
//     <Box sx={{ flexGrow: 0 }}>
//       <Tooltip title="Open settings">
//         <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//           <Avatar/>
//         </IconButton>
//       </Tooltip>
//       <Menu
//         sx={{ mt: '45px' }}
//         id="menu-appbar"
//         anchorEl={anchorElUser}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         keepMounted
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         open={Boolean(anchorElUser)}
//         onClose={handleCloseUserMenu}
//       >
//         {settings.map((setting) => (
//           <MenuItem key={setting} onClick={handleCloseUserMenu}>
//             <Typography textAlign="center">{setting}</Typography>
//           </MenuItem>
//         ))}
//       </Menu>
//     </Box>
//   )

//   const HamburgerMenu = () => (
//     <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//         <IconButton
//           size="large"
//           aria-label="account of current user"
//           aria-controls="menu-appbar"
//           aria-haspopup="true"
//           onClick={handleOpenNavMenu}
//           color="inherit"
//         >
//           <MenuIcon />
//         </IconButton>
//         <Menu
//           id="menu-appbar"
//           anchorEl={anchorElNav}
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'left',
//           }}
//           keepMounted
//           transformOrigin={{
//             vertical: 'top',
//             horizontal: 'left',
//           }}
//           open={Boolean(anchorElNav)}
//           onClose={handleCloseNavMenu}
//           sx={{
//             display: { xs: 'block', md: 'none' },
//           }}
//         >
//           {pages.map((page) => (
//             <MenuItem key={page} onClick={handleCloseNavMenu}>
//               <Typography textAlign="center"><Link to={targets[page]}>{page}</Link></Typography>
//             </MenuItem>
//           ))}
//         </Menu>
//       </Box>
//   )

//   const MobileBar = ({display}) => (
//     <>
//       <HamburgerMenu/>
//     </>
// )

//   const DesktopBar = ({display}) => (
//     <>

//       <Box sx={{ flexGrow: 1, display }}>
//         {pages.map((page) => (
//           <Button
//             key={page}
//             onClick={handleCloseNavMenu}
//             sx={{ my: 2, color: 'white', display: 'block' }}
//           >
//             <Link to={targets[page]}>{page}</Link>
//           </Button>
//         ))}

//       </Box>
//     </>
//   )

//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>

//           <MobileBar display={{ xs: 'flex', md: 'none' }}/>
//           <DesktopBar display={{ xs: 'none', md: 'flex' }}/>

//           <Logo/>

//           <BarAvatar/>

//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };
// export {ResponsiveAppBar};
