import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link} from 'react-router-dom'
import './css/Navbar.css';
import { useState, useEffect } from 'react';
// import { getTableRowUtilityClass } from '@mui/material';
import axios from 'axios'
import SearchBar from './SearchBar';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function Header({handleSearch}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [islogin, setlogin] = useState(false);
  const [name,setName] = useState("");
  const jwtToken = localStorage.getItem('jwt');
  const [searchText,setSearchText] = useState("");


  // const handleSearch = (searchText) => {
  //   setSearchText(searchText)
  //   console.log(`Searching for "${searchText}"...`);
  //   // perform search logic here
  // };

  

  useEffect(() => {  
    let Name = localStorage.getItem("name")
    if(Name){
      setName(Name)
      setlogin(true)
    }else{
      setlogin(false)
    }
  },[localStorage.getItem("name")])

  const logout = async () => {
    if(localStorage.getItem('jwt')){
      localStorage.removeItem('jwt');
      localStorage.removeItem('name');
      setlogin(false)
      setName("")
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
    <AppBar position="static" color="primary">

      <Container maxWidth="xl" fixed>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Cursive',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Eventro
          </Typography>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            </Menu>
          </Box> */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Cursive',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Eventro
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

          </Box>
{/* 
          {console.log("login",islogin)}
          {console.log("name",name)} */}
          <SearchBar  handleSearch={handleSearch}/>

          {islogin === true? <Typography mx="8px">Hello {name} </Typography>  : null}
          <Box sx={{ flexGrow: 0}}>
            <Tooltip title="Open settings">
              
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              <MenuItem key="1">
                <Link to='/'>Home</Link>
              </MenuItem>
              { islogin === false ? 
              <div>
              <MenuItem key="2">
                <Link to='/login'>Sign in</Link>
              </MenuItem>
              <MenuItem key="3">
                <Link to='/signup'>Sign up</Link>
              </MenuItem>
              </div>
              :
              <div>
                 <MenuItem key="2">
                <Link to='/profile'>Profile</Link>
              </MenuItem>
                <MenuItem key="4">
                  <Link to='/addevent'>Add event</Link>
                </MenuItem>
                <MenuItem key="5">
                  <Link to='/' onClick={logout}>Sign out</Link>
                </MenuItem>
              </div>
            }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  );
}
export default Header;