import React, { useState, useEffect } from "react";
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
import {Link} from "react-router-dom"
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      fetchModel("/user/list")
        .then((data) => {setUsers(data)})
        .catch((err) => console.log(err));
    }, []);

    return (
      <div>
        <List component="nav">
          {users.map((item) => (
            <React.Fragment key={item._id}>
              <ListItem 
                disablePadding
                secondaryAction={
                  <Box display="flex" gap={1}>
                    {/* Bong bóng xanh lá */}
                    <Chip 
                      label={item.photo_count || 0} 
                      size="small" 
                      sx={{ backgroundColor: '#4caf50', color: 'white' }} 
                    />
                    {/* Bong bóng đỏ*/}
                    <Chip 
                      label={item.comment_count || 0} 
                      size="small" 
                      clickable
                      component={Link}
                      to={`/comments/${item._id}`}
                      sx={{ backgroundColor: '#f44336', color: 'white' }} 
                    />
                  </Box>
                }
              >
                <ListItemButton component={Link} to={`/users/${item._id}`}>
                  <ListItemText primary={`${item.first_name} ${item.last_name}`} />
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
