import React, { useState, useEffect, useContext } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Chip
} from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { AppContext } from "../../context";

function UserList () {
  const { token, listUser, setListUser} = useContext(AppContext);

  useEffect(() => {
    if (token) {
      fetchModel("/user/list")
      .then((data) => {setListUser(data)})
      .catch((err) => console.log(err));
    }
  }, [token]); 
  
  if ( !token ) return <div></div>;
  return (
    <div>
      <List component="nav">
        {listUser.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem 
              disablePadding
              secondaryAction={
                <Box display="flex" gap={1}>
                  {/* Bong bóng xanh lá */}
                  <Chip 
                    label={user.photo_count || 0} 
                    size="small" 
                    sx={{ backgroundColor: '#4caf50', color: 'white' }} 
                  />
                  {/* Bong bóng đỏ*/}
                  <Chip 
                    label={user.comment_count || 0} 
                    size="small" 
                    clickable
                    component={Link}
                    to={`/comments/${user._id}`}
                    sx={{ backgroundColor: '#f44336', color: 'white' }} 
                  />
                </Box>
              }
            >
              <ListItemButton component={Link} to={`/users/${user._id}`}>
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
