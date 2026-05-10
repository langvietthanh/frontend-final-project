import {useContext} from "react";
import {Button, TextField, Divider} from "@mui/material";
import {useForm} from "react-hook-form";
import {AppContext} from "../../context"
import fetchModel from "../../lib/fetchModelData"
import {useParams} from "react-router-dom"

function AddComment({photoId}){
  const {setUserPhotos, token, setListUser, setSnackbar} = useContext(AppContext);
  const { userId } = useParams(); 
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm();
  function onSubmit(data){
    try{
      const fetchData = async () => {
        const res = await fetch(`https://34dct4-8081.csb.app/api/comment/commentsOfPhoto/${photoId}`,{
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            comment: data.comment,
          })
        })
        if (res.ok){
          reset();
          setSnackbar({open: true, message: "Comment added successfully", severity: "success"});
          fetchModel(`/photos/photosOfUser/${userId}`)
          .then(data => setUserPhotos(data))
          .catch(err => console.log(err))
          fetchModel("/user/list")
          .then((data) => setListUser(data))
          .catch((err) => console.log(err));
        }
      }
      fetchData();
    }
    catch(error){
      console.log(error);
    }
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)} sx ={{ ml: 2 }} >
      <TextField multiline maxRows={4} sx={{ width: 800 }} type="textbox" {...register("comment", {required: "Comment is empty"})} placeholder="Comment"/>
      <br/>
      <Button sx={{ mt: 2 }} type="submit" variant="contained">Send</Button>
    </form>
  )
}


export default AddComment;
