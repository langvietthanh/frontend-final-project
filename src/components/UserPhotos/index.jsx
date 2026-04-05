import React, { useEffect, useState } from "react";
import { Typography, Divider, Box, Button } from "@mui/material";

import "./styles.css";
import {useParams, Link, useNavigate} from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos ({setContentTopBar, advancedFeatures, setAdvancedFeatures}) {
    const {userId, photoId} = useParams();
    const [userPhotos, setUserPhotos] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      fetchModel(`/photosOfUser/${userId}`)
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

    // Xử lý đồng bộ URL và Checkbox an toàn (tránh làm hỏng chức năng cũ)
    useEffect(() => {
        if (advancedFeatures && userPhotos && userPhotos.length > 0 && !photoId) {
            navigate(`/photos/${userId}/${userPhotos[0]._id}`, { replace: true });
        } else if (!advancedFeatures && photoId) {
            navigate(`/photos/${userId}`, { replace: true });
        }
    }, [advancedFeatures, userPhotos, photoId, userId, navigate]);

    // Kích hoạt ngay lần đầu nếu truy cập bằng URL Deep-Link của một ảnh cụ thể
    useEffect(() => {
        if (photoId && setAdvancedFeatures) setAdvancedFeatures(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy một lần lúc mount để không block thao tác tắt checkbox

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
    <>
      {userPhotos.length > 0 ? userPhotos.map((photo) => <PhotoDetail photo={photo} key={photo._id}/>) : <Typography>No photos found.</Typography>} 
    </>

    );
}


function PhotoDetail({photo}){
  const formattedDate = new Date(photo.date_time).toLocaleString();

  return(
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" color="textSecondary">
        Time upload photo: {formattedDate}
      </Typography>
      <img src={require(`../../images/${photo.file_name}`)} alt={photo.file_name} style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: 8, marginBottom: 8 }}/>
      <CommentsOfPhoto comments={photo.comments}/>
      <Divider sx={{ mt: 2 }} />
    </Box>
  )
}

function CommentsOfPhoto({comments}){
  return(
    <div>
      {comments && 
      comments.map( 
        (comment) => <CommentDetail comment={comment} key={comment._id}/>)
        }
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

export default UserPhotos;
