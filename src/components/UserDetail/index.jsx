import { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import "./styles.css";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";


/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail( {setContentTopBar} ) {
    const { userId } = useParams();
    const [userModel, setUserModel] = useState(null);

    useEffect(() => {
        fetchModel(`/user/${userId}`)
            .then((user) => {
                setUserModel(user);
                if (setContentTopBar) {
                    setContentTopBar(`${user.first_name} ${user.last_name}`);
                }
            })
            .catch((err) => console.log(err));
    }, [userId, setContentTopBar]);

    if (!userModel) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>{userModel.first_name} {userModel.last_name}</Typography>
          <Typography variant="body1" gutterBottom><strong>Location:</strong> {userModel.location}</Typography>
          <Typography variant="body1" gutterBottom><strong>Description:</strong> {userModel.description}</Typography>
          <Typography variant="body1" gutterBottom><strong>Occupation:</strong> {userModel.occupation}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component={Link} to={`/photos/${userModel._id}`}>
                View Photos
            </Button>
          </Box>
        </Box>
    );
}

export default UserDetail;
