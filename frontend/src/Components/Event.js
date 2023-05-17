import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { FavoriteOutlined, FavoriteBorderOutlined } from '@mui/icons-material';
import ChatBubbleOutlined from '@mui/icons-material/ChatBubbleOutlined'
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RWebShare } from "react-web-share";
import { TextField, Button, Box, Divider } from '@mui/material';
import { SendOutlined } from '@mui/icons-material';
import axios from 'axios'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));



export default function Event({ data }) {
  let Comments = data.comments ? eval(data.comments) : []
  let Likes = data.likes ? eval(data.likes) : []
  Likes = Likes.filter((item) => item.user_id == 1)
  Likes = Likes.length ? true : false 
  const [expanded, setExpanded] = React.useState(false);
  const [comments, setComments] = React.useState(Comments);
  // const [likes, setLikes] = React.useState(Likes);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(Likes);
  let date = new Date(data.createdAt * 1000).toLocaleString()
  console.log(date,data.createdAt)

  const handleLike = async() => {
    try {
      console.log("event id : ",data.event_id)
      let event_id = data.event_id
      let user_id = 1   
      let response = await axios.post('/addLike', {
        event_id, user_id
      })
      console.log(response)
      setLiked(!liked);
    } catch (error) {
      console.log(error)
    }
  };

  const addComment = async (event) => {
    try{
      event.preventDefault();
      let event_id = data.event_id
      let user_id = 1
      let response = await axios.post('/addComment', {
         event_id, user_id, comment : newComment
      })
      console.log("Comments : ",response)
      setComments((comments) => [...comments, {"user_id" : 1, "comment" : newComment}]);
      setNewComment('');
      // toast.success("Comment added successfull!")
    }catch(error){
        console.log(error)
    }
  }
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 752, border: '1px solid rgba(0,0,0,0.4)' }}>
      <CardHeader sx={{ marginBottom: '-15px' }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {data.username[0]}
          </Avatar>
        }
        title={data.username}
        subheader={date}
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          <span style={{ "fontWeight": "bold" }}>Name</span>  : {data.event_name} <br />
          <span style={{ "fontWeight": "bold" }}>Place</span>  : {data.location} <br />
          <span style={{ "fontWeight": "bold" }}>Date & Time</span>  : {new Date(data.event_date * 1000).toLocaleString()} <br />
          <span style={{ "fontWeight": "bold" }}>Description</span>  : {data.event_description}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="194"
        image={`http://127.0.0.1:5000/api/uploads/${data.event_id}.jpg`}
        alt="Image"
        sx={{ px: 2 }}
      />

      <CardActions style={{ "display": "flex", "justifyContent": "space-evenly" }}>

        <IconButton aria-label="like" onClick={handleLike} style={{ width: "32.5%" }} color="error">
          {liked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
        </IconButton>
        <IconButton aria-label="comment" style={{ width: "32.5%", color: "#537188" }} 
          onClick={() => handleExpandClick()}>
          <ChatBubbleOutlined />
        </IconButton>

        <RWebShare
          data={{
            text: "Events are for everyone",
            url: "https://on.natgeo.com/2zHaNup",
            title: "Eventro",
          }}
          onClick={() => console.log("shared successfully!")}
        >

          <IconButton aria-label="share" color="info" style={{ width: "32.5%" }}>
            <ShareIcon />
          </IconButton>
        </RWebShare>

      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* <Typography variant="h6" sx={{ mt: 0, mb: 1 }}>Comments</Typography> */}
            <Divider sx={{ width: '100%', mb: 2 }} />
            <form onSubmit={async(e) => await addComment(e)} style={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }}>U</Avatar>
                <TextField
                  id="comment"
                  label="Write a comment"
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                />
                <IconButton type="submit" sx={{ ml: 2 }}>
                  <SendOutlined />
                </IconButton>

              </Box>
            </form>

          </Box>
          <Divider sx={{ width: '100%', mb: 2, mt: 2 }} />
          {comments.map((comment, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2 }}>U</Avatar>
              <Typography variant="body1">{comment['comment']}</Typography>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}