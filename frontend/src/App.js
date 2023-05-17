// import logo from './logo.svg';
// import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './Components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './Components/LogIn';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import AddEvent from './Components/AddEvent';
import Profile from "./Components/Profile";
import axios from "axios";
import { useEffect, useState } from "react";


function App() {
  
  const [Data,setData] = useState([])
  const [Page_num,setPage_num] = useState(1)
  const [searchText,setSearchText] = useState("")

  const handleSearch = async (event) => {
    // setSearchText(event.target.value)
    setPage_num(1)
    console.log(`Searching for "${event.target.value}"...`);
    setSearchText(event.target.value)
    axios('/searchEvents', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'text' : event.target.value
        }
    })
    .then(data => {
          console.log(data)
          setData((prevData) => [...data.data])
          // setName(response.data.firstname)
          // setlogin(true)
          // console.log(response.data.firstname)
    })
    .catch(error => {
          // setlogin(false)
          // window.location.href = '/login'
    });
  }


  const fetchData = async () => {
    // handleOpen()
    let user_id = localStorage.getItem("user_id")
    let url = `/getEvents?user_id=${user_id}&page_number=${Page_num}`
    axios.get(url)
      .then(data => {
        setData((prevData) => [...prevData, ...data.data])
        setPage_num((old) => old + 1)
        console.log(data)
        // handleClose()
      })
      .catch(error => {
        // handleClose()
        console.log("Error : ", error)
      });
  }

  useEffect(() => {
    if(searchText == "")
      (async() => await fetchData())()
  },[searchText]) 


  // useEffect(() => {
  //     (async() => await fetchData())()
  // },[]) 


  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={
          <button
            style={{
              width: "30px",
              backgroundColor: "inherit",
              border: "none",
              color: "white",
            }}
          >
            X
          </button>
        }
      />


      <Router>
        <Header handleSearch={handleSearch}/>
        <Routes>
          <Route exact path='/' element={<Dashboard Data={Data} fetchData={fetchData} />}></Route>
          <Route exact path='/login' element={<LogIn/>}></Route>
          <Route exact path='/signup' element={<SignUp/>}></Route> 
          <Route exact path='/addevent' element={<AddEvent/>}></Route>
          <Route exact path='/profile' element={<Profile/>}></Route>
        </Routes>
        
      </Router>
    </div> 
  );
}

export default App;
