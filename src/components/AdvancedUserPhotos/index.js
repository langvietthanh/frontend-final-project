import {useEffect, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom"
import {PhotoDetail} from "../UserPhotos"
import {Box, Button, Typography} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import { AppContext, PhotoContext } from "../../context"; 


function AdvancedUserPhotos () {
    const {userId, photoId} = useParams(); 
    const navigate = useNavigate();
    const { userPhotos } = useContext(AppContext);

    if (!userPhotos) return <Typography>Loading...</Typography>;

    if (userPhotos.length === 0) return <Typography variant="h5" >Empty</Typography>;

    let currentIndex = 0;
    if (photoId) {
        const foundIndex = userPhotos.findIndex(p => p._id === photoId);
        if (foundIndex !== -1) currentIndex = foundIndex;
    }
    const currentPhoto = userPhotos[currentIndex];

    function handleNext(){
        const nextPhoto = userPhotos[currentIndex + 1];
        navigate(`/photos/${userId}/${nextPhoto._id}`); // Chuyển URL sang ảnh tiếp theo
    }

    function handlePrev(){
        const prevPhoto = userPhotos[currentIndex - 1];
        navigate(`/photos/${userId}/${prevPhoto._id}`); // Chuyển URL sang ảnh trước đó
    }

    return(
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" onClick={handlePrev} disabled={currentIndex === 0}>Prev</Button>
                <Button variant="contained" onClick={handleNext} disabled={currentIndex === userPhotos.length - 1}>Next</Button>
            </Box>
            {currentPhoto && <PhotoDetail photo={currentPhoto}/>}
        </Box>
    )

}

export default AdvancedUserPhotos;