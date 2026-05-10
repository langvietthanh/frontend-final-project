import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import fetchModel from "../../lib/fetchModelData";
import { Box, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { AppContext } from "../../context";

function UserComment() {
  const { setUserPhotos } = useContext(AppContext);
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchModel(`/comment/commentOfUser/${userId}`)
      .then((data) => setPhotos(data))
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Comments of User
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {photos &&
        photos.map((photo) => (
          <Box
            key={photo._id}
            sx={{ mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}
          >
            <Link to={`/photos/${photo.user_id}`}>
              <img
                src={`https://34dct4-8081.csb.app/images/${photo.file_name}`}
                alt={photo.file_name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                onClick={() => setUserPhotos(null)}
              />
            </Link>
            <Box>
              {photo.comments &&
                photo.comments
                  .filter((c) => c.user_id === userId)
                  .map((comment) => (
                    <Typography key={comment._id} variant="body1">
                      "{comment.comment}"
                    </Typography>
                  ))}
            </Box>
          </Box>
        ))}
    </Box>
  );
}

export default UserComment;
