import { useEffect, useState, useContext } from "react";
import { Typography, Divider, Box, Button } from "@mui/material";
import { set, useForm } from "react-hook-form";

import "./styles.css";
import {useParams, Link, useNavigate} from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { AppContext, PhotoContext } from "../../context";
import { use } from "react";

function UserPhotos () {
  const {setContentTopBar, advancedFeatures, setAdvancedFeatures, userPhotos, setUserPhotos} = useContext(AppContext);
  const {userId, photoId} = useParams();
  const navigate = useNavigate();
  const contextValue = {
    userId
  };

  useEffect(() => { 
    fetchModel(`/photos/photosOfUser/${userId}`)
    .then(data => setUserPhotos(data))
    .catch(err => console.log(err))
  }, [userId]);


  useEffect(() => {
      fetchModel(`/user/${userId}`)
          .then((user) => {
              if (setContentTopBar) {
                  setContentTopBar(`Photos of ${user.first_name} ${user.last_name}`);
              }
          })
          .catch(console.log);
  }, [userId, setContentTopBar]);

  useEffect(() => {
      if (advancedFeatures && userPhotos && userPhotos.length > 0 && !photoId) {
          navigate(`/photos/${userId}/${userPhotos[0]._id}`, { replace: true });
      } else if (!advancedFeatures && photoId) {
          navigate(`/photos/${userId}`, { replace: true });
      }
  }, [advancedFeatures, userPhotos, photoId, userId, navigate]);

  useEffect(() => {
      if (photoId && setAdvancedFeatures) setAdvancedFeatures(true);
  }, []); 

  if (!userPhotos) return <Typography>Loading...</Typography>;

  if (advancedFeatures && userPhotos.length > 0) {
      let currentIndex = 0;
      if (photoId) {
          const foundIndex = userPhotos.findIndex(p => p._id === photoId);
          if (foundIndex !== -1) currentIndex = foundIndex;
      }
      const currentPhoto = userPhotos[currentIndex];

      const handleNext = () => {
          navigate(`/photos/${userId}/${userPhotos[currentIndex + 1]._id}`);
      };
      
      const handlePrev = () => {
          navigate(`/photos/${userId}/${userPhotos[currentIndex - 1]._id}`);
      };

      return (
          <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Button variant="contained" disabled={currentIndex === 0} onClick={handlePrev}>Previous</Button>
                  <Button variant="contained" disabled={currentIndex === userPhotos.length - 1} onClick={handleNext}>Next</Button>
              </Box>
              <PhotoDetail photo={currentPhoto} />
          </Box>
      );
  }

  return (
  <PhotoContext.Provider value = {contextValue}>
    {userPhotos.length > 0 ? userPhotos.map((photo) => <PhotoDetail photo={photo} key={photo._id} />) : <Typography>No photos found.</Typography>} 
  </PhotoContext.Provider>

  );
}

function PhotoDetail({photo}){
  const formattedDate = new Date(photo.date_time).toLocaleString();

  return(
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" color="textSecondary">
        Time upload photo: {formattedDate}
      </Typography>
      <img src={`http://localhost:8081/images/${photo.file_name}`} alt={photo.file_name} style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: 8, marginBottom: 8 }}/>
      <CommentsOfPhoto comments={photo.comments} photoId={photo._id} />
      <Divider sx={{ mt: 2 }} />
    </Box>
  )
}

function CommentsOfPhoto({comments, photoId}){
  return(
    <div>
      {comments && 
      comments.map( 
        (comment) => <CommentDetail comment={comment} key={comment._id}/>)
      }
      <Typography variant="h5">Write a new comment:</Typography>
      <AddComment photoId={photoId} />
    </div>
  )
}

function CommentDetail({comment}){
  const user = comment.user;
  const formattedDate = new Date(comment.date_time).toLocaleString();

  return(
    <div>
      <Typography variant="subtitle1" fontWeight="bold">
        user: <Link to= {`/users/${user._id}`}>{comment.user.first_name} {comment.user.last_name}</Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">date time: {formattedDate}</Typography>
      <Typography variant="body1">comment: {comment.comment}</Typography>
    </div>
  )
} 

function AddComment({photoId}){
  const {setUserPhotos, user, token, setListUser} = useContext(AppContext);
  const {userId} = useContext(PhotoContext);
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm();
  function onSubmit(data){
    try{
      const fetchData = async () => {
        const res = await fetch(`http://localhost:8081/api/photos/commentsOfPhoto/${photoId}`,{
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
          alert("Upload comment success")
          fetchModel(`/photos/photosOfUser/${userId}`)
          .then(data => setUserPhotos(data))
          .catch(err => console.log(err))
          fetchModel("/user/list")
          .then((data) => {setListUser(data)})
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="textbox" {...register("comment", {required: "Comment is empty"})} placeholder="Comment"/>
      <button type="submit">Send</button>
    </form>
  )
}

export default UserPhotos;
