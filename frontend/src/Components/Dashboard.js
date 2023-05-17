import React, { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Event from "./Event";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';


export default function Dashboard({Data,fetchData}) {
  console.log("Data ",Data)
  // const [Data, setData] = useState(data)
  const [open, setOpen] = React.useState(false);
  const [page_num, setPage_num] = useState(1)

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // const fetchData1 = async () => {
  //   handleOpen()
  //   await fetchData(page_num)
  //   setPage_num((old) => old + 1)
  // }

  // useEffect(() => {
  //   fetchData1()
  // }, [])

  return (

    <>

      <CssBaseline />
      <Backdrop sx={{ color: '#fff', backgroundColor: 'rgba(0,0,0,0.25)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
      </Backdrop>
      <Container maxWidth="md">
        <Box sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyItems: "center",
          border: 1,
        }}
        >
          <InfiniteScroll
            dataLength={Data.length}
            next={fetchData}
            hasMore={true}
            loader={<h1>Loading...</h1>} >

            <Grid container spacing={2} item
              direction="row"
              alignItems="center"
              justifyContent="center">

              {Data.map((event, idx) =>
                <Grid item xs={10} key={idx} sx={{ mt: 3 }}>
                  <Event data={event} />
                </Grid>
              )}
            </Grid>
          </InfiniteScroll>
        </Box>
      </Container>


    </>
  )
}