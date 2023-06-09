import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to='/' style={{ color: "#303030" }}>
        Eventro
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function LogIn() {

  const navigate = useNavigate();
  const [formValidator, setFormValidator] = React.useState({
    email: true,
    password: true
  })
  const [checkSignin, setSignin] = useState(" ")
  const [Loader, setLoader] = useState(false)

  const validator = (data) => {
    const username = data.get('username');
    const password = data.get('password')
    let isValid = true;

    // if (email == ''){
    // 	setFormValidator((data) => ({...data,email:"This field is required"}))
    // 	isValid = false;
    // }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
    // 	setFormValidator((data) => ({...data,email:"Enter valid email address"}));
    // 	isValid = false;
    // }else setFormValidator((data) => ({...data,email:""}))

    if (password == '') {
      setFormValidator((data) => ({ ...data, password: "This field is required" }))
      isValid = false;
    } else if (password.length < 8) {
      setFormValidator((data) => ({ ...data, password: "Password must be 8 character long" }));
      isValid = false;
    } else setFormValidator((data) => ({ ...data, password: "" }))

    return [isValid, username, password];
  }

  const handleSubmit = async (event) => {
    try {
      setLoader(true)
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const [isValid, username, password] = validator(data)

      if (isValid) {
        console.log("signin")
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        })
        const resp = await response.json()
        console.log(resp);
        if (resp.status == 200) {
          localStorage.setItem("jwt", resp.access_token)
          localStorage.setItem("name", resp.firstname)
          localStorage.setItem("user_id", resp.user_id)
          setLoader(false)
          setSignin("Sign successfull!")
          toast.success("Your login successfull!")
          navigate("/")
        } else {
          setLoader(false)
          setSignin(resp.message);
          toast.error(resp.message)
        }
      }
    } catch (error) {
      setLoader(false)
    }

  };


  return (
    <ThemeProvider theme={theme}>
      {Loader ? <Spinner/> : ""}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {checkSignin == " " ? null : <label style={{ "color": "red" }}>{checkSignin}</label>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            {formValidator.email == true ? null : <label style={{ "color": "red" }}>{formValidator.email}</label>}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {formValidator.password == true ? null : <label style={{ "color": "red" }}>{formValidator.password}</label>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}