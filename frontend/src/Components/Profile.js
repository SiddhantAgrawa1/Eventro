import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import './css/profile.css'
import { toast } from 'react-toastify';
import Spinner from './Spinner'

const Profile = () => {

    const [data, setData] = useState({
        status: 400,
        name: "",
        email: "",
        username : ""
    })
    const [Loader, setLoader] = useState(true)

    const getDetails = async () => {
        // Fetching user details
        try {
            setLoader(true)
            let token = localStorage.getItem("jwt")
            const response = await fetch('/protected',{
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            })
            const user = await response.json()
            console.log("User",user)
            setData({
                status: 200,
                name: user.firstname + " " + user.lastname,
                email: user.email,
                username : user.username
            })
            setLoader(false)
        } catch (error) {
            setLoader(false)
            console.log(error)
            toast.error(error.statuText)
        }
    }

    useEffect(() => {
        (async() => {
           await getDetails()
        })()
    }, [])

    return (
        <div>
        {Loader ? <Spinner /> : ""}
            {
                data.status === 200 ?
                    <div className='about'>
                        <h1>Eventro</h1>
                        <p>Your Name : {data.name}</p>
                        <p>Your Email : {data.email}</p>
                        <p>Your Username : {data.username}</p>
                    </div>
                    :
                    <Typography component="h1" variant="h5" color="primary">Please login!</Typography>
            }
        </div>
    )
}

export default Profile;
