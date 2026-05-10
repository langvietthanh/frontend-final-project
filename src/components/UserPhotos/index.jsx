import { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Divider, Box } from "@mui/material";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { AppContext } from "../../context";
import CommentsOfPhoto from "./CommentsOfPhoto";
import AdvancedUserPhotos from "../AdvancedUserPhotos";

function UserPhotos() {
  const {
    setContentTopBar,
    advancedFeatures,
    setAdvancedFeatures,
    userPhotos,
    setUserPhotos,
  } = useContext(AppContext);
  const { userId, photoId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel(`/photos/photosOfUser/${userId}`)
      .then((data) => setUserPhotos(data))
      .catch((err) => console.log(err));
  }, [userId, setUserPhotos]);

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
  }, [photoId, setAdvancedFeatures]);

  if (!userPhotos) return <Typography>Loading...</Typography>;

  return advancedFeatures ? (
    <AdvancedUserPhotos />
  ) : (
    <>
      {userPhotos.length > 0 ? (
        userPhotos.map((photo) => <PhotoDetail photo={photo} key={photo._id} />)
      ) : (
        <Typography>No photos found.</Typography>
      )}
    </>
  );
}

function PhotoDetail({ photo }) {
  const formattedDate = new Date(photo.date_time).toLocaleString();
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" color="textSecondary">
        Time upload photo: {formattedDate}
      </Typography>
      <img
        src={`https://34dct4-8081.csb.app/images/${photo.file_name}`}
        alt={photo.file_name}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          marginTop: 8,
          marginBottom: 8,
        }}
      />
      <CommentsOfPhoto comments={photo.comments} photoId={photo._id} />
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

export { PhotoDetail };
export default UserPhotos;
