import { Box, Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useContext } from "react"
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { AppContext } from "../../context";

function EditComment({content, setEditClicked, comment_id, photoId}){
  const [commentEdited, setCommentEdited] = useState(content);
  const {token, setSnackbar, setUserPhotos} = useContext(AppContext);
  const {userId} = useParams();

  function handleConfirm(e){
    e.preventDefault();
    try {
      const data = {
        comment: commentEdited
      };  
      const fetchData = async () => {
        const res = await fetch(`http://localhost:8081/api/comment/${photoId}/${comment_id}`, {
          method: "PUT",
          headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data)
        })
        if(res.ok){
          setSnackbar({open: true, message: "Edit comment success", severity: "success"});
          fetchModel(`/photos/photosOfUser/${userId}`)
            .then(data => setUserPhotos(data))
            .catch(err => console.log(err));
          setEditClicked(false);
        }
        else setSnackbar({open: true, message: "Edit comment fail", severity: "error"})
      }
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }
  return( 
  <Box display="block">
    <TextField multiline maxRows={4} type="text" onChange={(e) => setCommentEdited(e.target.value)} value={commentEdited} sx= {{width:800}}/>
    <Box>
        <Button onClick={handleConfirm} variant="contained" color="primary" sx={{ mt: 2 }}>Confirm</Button>
        <Button onClick={() => setEditClicked(false)} variant="contained" color="error" sx={{ mt: 2 , ml: 2}}>Cancel</Button>
    </Box>
  </Box>
  )
}

export default EditComment;