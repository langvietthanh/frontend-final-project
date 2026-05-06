import { Typography, Box, Button, TextField } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useState, useContext } from "react"
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import AddComment from "./AddComment"
import EditComment from "./EditComment"
import { AppContext } from "../../context";

function CommentsOfPhoto({comments, photoId}){
  return(
    <div style={{padding: 8}}>
      {comments && 
      comments.map( 
        (comment) => <CommentDetail comment={comment} key={comment._id} photoId={photoId}/>)
      }
      <Typography variant="h5">Write a new comment:</Typography>
      <AddComment photoId={photoId} />
    </div>
  )
}

function CommentDetail({comment, photoId}){
  const { user: loggedInUser, token, setUserPhotos, setListUser, setSnackbar } = useContext(AppContext);
  const userComment = comment.user;
  const content = comment.comment;
  const { userId } = useParams(); 
  const [commentClicked, setCommentClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const formattedDate = new Date(comment.date_time).toLocaleString();

  const isUserComment = loggedInUser && loggedInUser._id === userComment._id;

  function handleDelete(e){
    e.stopPropagation();
    try {
      const fetchData = async () => {
        const res = await fetch(`http://localhost:8081/api/comment/${photoId}/${comment._id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          setSnackbar({open: true, message: "Delete comment success", severity: "success"});
          fetchModel(`/photos/photosOfUser/${userId}`)
            .then(data => setUserPhotos(data))
            .catch(err => console.log(err));
          fetchModel("/user/list")
            .then((data) => setListUser(data))
            .catch((err) => console.log(err));
        } 
        else {
          setSnackbar({open: true, message: "Delete comment fail", severity: "error"});
        }
      }
      fetchData();
    } 
    catch (error) {
      console.log(error);
    }
  }

  return(
    <div onClick={() => setCommentClicked(!commentClicked)} style={{ cursor: isUserComment ? "pointer" : "default", padding: '8px', borderBottom: '1px solid #eee' }}>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          user: <Link to={`/users/${userComment._id}`} onClick={(e) => e.stopPropagation()}> 
          {comment.user.first_name} {comment.user.last_name}
          </Link>
        </Typography>
        
      </Box>
      <Typography variant="body2" color="textSecondary">date time: {formattedDate}</Typography>
      {editClicked ? 
      <EditComment content={content} setEditClicked={setEditClicked} comment_id={comment._id} photoId={photoId}/>
      :
      <>
        <Typography variant="body1" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>comment: {content}</Typography>
        {commentClicked && isUserComment && (
          <Box>
            <Button onClick={() => setEditClicked(true)} variant="contained" size="small" >Edit</Button>
            <Button onClick={handleDelete} variant="contained" color="error" size="small" sx={{ ml: 2 }}>Delete</Button>
          </Box>
        )}
      </> 
      }
    </div>
  )
} 

export default CommentsOfPhoto;