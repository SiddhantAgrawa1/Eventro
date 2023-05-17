import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from './Spinner'

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link to="/" style={{ color: "#303030" }}>
				Eventro
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const theme = createTheme();

export default function SignUp() {

	const [formValidator, setFormValidator] = React.useState({
		firstName: true,
		lastName: true,
		username: true,
		email: true,
		password: true,
	})
	const [checkSignup, setSignup] = useState(" ");
	const [Loader, setLoader] = useState(false)
	const navigate = useNavigate();

	const validate = (data) => {
		const firstName = data.get("firstName");
		const lastName = data.get("lastName");
		const username = data.get('username')
		const email = data.get("email");
		const password = data.get('password');
		const conf_pass = data.get("Conf_password")

		let isValid = true;

		if (firstName === '') {
			console.log(formValidator)
			setFormValidator((data) => ({ ...data, firstName: "This field is required" }))
			isValid = false;
		} else if (!(/^[a-zA-Z]+$/.test(firstName))) {
			setFormValidator((data) => ({ ...data, firstName: "Enter valid firstname" }));
			isValid = false;
		} else setFormValidator((data) => ({ ...data, firstName: "" }))

		if (lastName == '') {
			setFormValidator((data) => ({ ...data, lastName: "This field is required" }))
			isValid = false;
		} else if (!(/^[a-zA-Z]+$/.test(lastName))) {
			setFormValidator((data) => ({ ...data, lastName: "Enter valid lastname" }));
			isValid = false;
		} else setFormValidator((data) => ({ ...data, lastName: "" }))

		if (email == '') {
			setFormValidator((data) => ({ ...data, email: "This field is required" }))
			isValid = false;
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
			setFormValidator((data) => ({ ...data, email: "Enter valid email address" }));
			isValid = false;
		} else setFormValidator((data) => ({ ...data, email: "" }))

		if (username === '') {
			setFormValidator((data) => ({ ...data, username: "This field is required" }))
			isValid = false;
		} else if (!(/^[a-zA-Z0-9]+$/.test(username))) {
			setFormValidator((data) => ({ ...data, username: "Enter valid username" }));
			isValid = false;
		} else setFormValidator((data) => ({ ...data, username: "" }))


		if (password == '') {
			setFormValidator((data) => ({ ...data, password: "This field is required" }))
			isValid = false;
		} else if (password.length < 8) {
			setFormValidator((data) => ({ ...data, password: "Password must be 8 character long" }));
			isValid = false;
		} else setFormValidator((data) => ({ ...data, password: "" }))

		if(password !== conf_pass){
			isValid = false;
			toast.error("Password and confirm password must be same!")
		}

		return [isValid, firstName, lastName, username, email, password];
	}


	const handleSubmit = async (event) => {
		try {
			event.preventDefault();
			setLoader(true)
			const data = new FormData(event.currentTarget);

			const [isValid, firstname, lastname, username, email, password] = validate(data)

			if (isValid) {
				const response = await fetch('/signup', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ firstname, lastname, username, email, password })
				})

				const data = await response.json()
				
				if (data.status == 200) {
					setSignup("Registration done successfully")
					localStorage.setItem("name", firstname)
					localStorage.setItem("jwt", data.access_token)
					localStorage.setItem("user_id", data.user_id)
					setLoader(false)
					toast.success("Registration done successfully!")
					navigate('/')
				} else if (data.status == 402) {
					setSignup("User already exist")
					toast.error("This your username already exist!")
				} else {
					setSignup("OOPs! Not able to register you")
					toast.error("OOPs! Something went wrong!")
				}
			}
			setLoader(false)
		} catch (error) {
			setLoader(false)
			console.log(error)
			toast.error(error.statusText)
		}
	}

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
						Sign up
					</Typography>
					{checkSignup == " " ? null : <label style={{ "color": "red", "fontSize": "1.4rem" }}>{checkSignup}</label>}
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
								{formValidator.firstName == true ? null : <label style={{ "color": "red" }}>{formValidator.firstName}</label>}
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
								{formValidator.lastName == true ? null : <label style={{ "color": "red" }}>{formValidator.lastName}</label>}
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="username"
									label="Username"
									name="username"
									autoComplete="username"
								/>
								{formValidator.username == true ? null : <label style={{ "color": "red" }}>{formValidator.username}</label>}
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
								{formValidator.email == true ? null : <label style={{ "color": "red" }}>{formValidator.email}</label>}
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
								{formValidator.password == true ? null : <label style={{ "color": "red" }}>{formValidator.password}</label>}
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="Conf_password"
									label="Confirm Password"
									type="password"
									id="Conf_password"
									autoComplete="new-password"
								/>
								{/* {formValidator.password == true ? null : <label style={{ "color": "red" }}>{formValidator.password}</label>} */}
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link to="/signin" variant="body2">Already have an account? Sign in </Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</ThemeProvider>
	);
}