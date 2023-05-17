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
import PhotoIcon from '@mui/icons-material/Photo';
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { toast } from 'react-toastify';

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

export default function AddEvent() {

    const [formValidator, setFormValidator] = React.useState({
        Eventname: true,
        Location: true,
        Description: true,
        Image: true,
        Datetime: "",
        Category : ""
    })
    const [open, setOpen] = React.useState(false);
    const [checkSignup, setSignup] = useState(" ");
    const [Loader, setLoader] = useState(true)
    const [userData,setUserData] = useState([])
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem('jwt');
    const [Image, setImage] = useState("")
    let username = "";
    const ref = React.useRef(null)
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const getDetails = async () => {
        // Fetching user details
        try {
            setLoader(true)
            let token = localStorage.getItem("jwt")
            if (token) {
                const response = await fetch('/protected', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const user = await response.json()
                setUserData(user)
                console.log(user)
                setLoader(false)
            } else {
                throw new Error("Unauthorized!")
            }
        } catch (error) {
            setLoader(false)
            toast.error("Unauthorized!")
            navigate('/login')
        }
    }


    React.useEffect(() => {
        console.log(ref)
        if (ref.current == null) {
            ref.current = 2;
            (async () => {
                await getDetails()
            })()
        }
    }, [])

    const validate = (data) => {
        const eventName = data.get("eventName");
        const location = data.get("location");
        const datetime = data.get('datetime')
        const description = data.get("description");
        const image = data.get('file');
        const category = data.get("category");
        let isValid = true;

        if (eventName === '') {
            setFormValidator((data) => ({ ...data, Eventname: "This field is required" }))
            isValid = false;
        } else setFormValidator((data) => ({ ...data, Eventname: "" }))

        if (category === '') {
            setFormValidator((data) => ({ ...data, Category: "This field is required" }))
            isValid = false;
        } else setFormValidator((data) => ({ ...data, Category: "" }))

        if (location === '') {
            setFormValidator((data) => ({ ...data, Location: "This field is required" }))
            isValid = false;
        } else setFormValidator((data) => ({ ...data, Location: "" }))

        if (datetime === '') {
            setFormValidator((data) => ({ ...data, Datetime: "This field is required" }))
            isValid = false;
        } else setFormValidator((data) => ({ ...data, Datetime: "" }))

        if (description === '') {
            setFormValidator((data) => ({ ...data, Description: "This field is required" }))
            isValid = false;
        } else setFormValidator((data) => ({ ...data, Description: "" }))

        return [isValid, eventName, location, datetime, description, image, category];
    }

    const formData = new FormData();
    const handleFileChange = async (event) => {
        debugger
        const file = event.target.files[0];
        formData.append('file', file);
        setImage(file)
        toast.success("Your file upload successfully!")
    };


    const handleSubmit = async (event) => {
        try {
            debugger
            event.preventDefault();
            handleOpen()
            const data = new FormData(event.currentTarget);
            let user_id = userData['user_id'];
            let username = userData['username']
            const jwtToken = localStorage.getItem('jwt');
            let [isValid, eventName, location, datetime, description, image,category] = validate(data)
            let event_name = eventName
            let event_description = description
            let event_date = new Date(datetime).getTime() / 1000 
            let createdAt = new Date().getTime() / 1000
            let imageData = new FormData();
            imageData.append("file",Image)
            console.log("ImageData : ", imageData.get("file"))

            if (isValid) {
                const response = await fetch('/addEvent', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, event_name, location, event_date, category,event_description,user_id, createdAt, comments : [], likes : []})
                })
                const data = await response.json()
                if (data.status == 200) {
                    console.log("Image",formData.get("file"))
                    await axios.post('/api/upload', imageData).then((response) => {
                        // ... handle the response from the backend
                        console.log("response : ", response)
                    })
                        .catch((e) => {
                            console.log("Error", e);
                            throw e;
                        })
                    console.log("Registration done successfully")
                    handleClose()
                    toast.success("Your event added successfully!")
                    navigate('/')
                }
                else {
                    handleClose()
                    setSignup("OOPs! Something went wrong");
                    toast.error(response.msg)
                }
            }
            handleClose()
        } catch (error) {
            handleClose()
            console.log(error)
            toast.error(error.statusText)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Backdrop sx={{ color: '#fff', backgroundColor: 'rgba(0,0,0,0.25)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        {/* <LockOutlinedIcon /> */}
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Event
                    </Typography>
                    {/* {checkSignup == " " ? null : <label style={{ "color": "red", "fontSize": "1.4rem" }}>{checkSignup}</label>} */}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="eventName"
                                    required
                                    fullWidth
                                    id="eventName"
                                    label="Event Name"
                                    autoFocus
                                />
                                {formValidator.EventName == true ? null : <label style={{ "color": "red" }}>{formValidator.Eventname}</label>}
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="location"
                                    label="location"
                                    name="location"
                                    autoComplete="location"
                                />
                                {formValidator.Location == true ? null : <label style={{ "color": "red" }}>{formValidator.Location}</label>}
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2} >
                                <Grid item xs={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="category"
                                            required
                                            fullWidth
                                            id="category"
                                            label="category"
                                            autoFocus
                                        />
                                        {formValidator.Category == true ? null : <label style={{ "color": "red" }}>{formValidator.Eventname}</label>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="datetime-local"
                                            name="datetime"
                                            // label="Date & Time"
                                            id="datetime"
                                            autoComplete="datetime"
                                            size="medium"
                                            inputProps={{
                                                // only needs the first 16 characters in the date string
                                                min: new Date().toISOString().slice(0, 16),
                                            }}
                                        />
                                        {formValidator.Datetime == true ? null : <label style={{ "color": "red" }}>{formValidator.Datetime}</label>}
                                    </Grid>
                                    
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline={true}
                                    rows={7}
                                    name="description"
                                    label="description"
                                    id="description"
                                    autoComplete="description"
                                    size="medium"
                                />
                                {formValidator.Description == true ? null : <label style={{ "color": "red" }}>{formValidator.Description}</label>}
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    endIcon={<PhotoIcon />}
                                // sx={{ mt: 2}}
                                >
                                    {/* Upload Image */}
                                    <input
                                        id='file'
                                        accept="image/*"
                                        type="file"
                                        onChange={async (e) => await handleFileChange(e)}
                                    />

                                </Button>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/signin" variant="body2">Already have an account? Sign in </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                {/* <Copyright sx={{ mt: 5 }} /> */}
            </Container>
        </ThemeProvider>
    );
}