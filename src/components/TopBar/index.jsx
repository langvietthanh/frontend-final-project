import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { AppContext } from "../../context";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function TopBar() {
  const {
    setSnackbar,
    setContentTopBar,
    contentTopBar,
    setAdvancedFeatures,
    advancedFeatures,
    token,
    setToken,
    user,
    setUser,
    setUserPhotos,
    setListUser,
  } = useContext(AppContext);
  const navigate = useNavigate();

  function handleLogout() {
    setContentTopBar("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  }

  const handleUpload = async (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("uploadedphoto", e.target.files[0]);
      try {
        const res = await fetch("https://34dct4-8081.csb.app/api/photos/new", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        });
        if (res.ok) {
          // load lai anh
          fetchModel(`/photos/photosOfUser/${user._id}`)
            .then((data) => setUserPhotos(data))
            .catch((err) => console.log(err));
          // load lai thong tin tat ca nguoi dung
          fetchModel("/user/list")
            .then((data) => {
              setListUser(data);
            })
            .catch((err) => console.log(err));
          setSnackbar({
            open: true,
            message: "Upload success",
            severity: "success",
          });
          navigate(`/photos/${user._id}`);
        } else {
          setSnackbar({
            open: true,
            message: "Upload fail",
            severity: "error",
          });
        }
      } catch (error) {
        console.log("Upload error:", error);
      }
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        {!token ? (
          <Typography variant="h5" color="inherit">
            Please Login
          </Typography>
        ) : (
          <>
            <Typography variant="h5" color="inherit" sx={{ mr: 2 }}>
              Hi {user?.first_name}
            </Typography>
            <Button variant="contained" component="label" sx={{ mr: 2 }}>
              Add Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {setAdvancedFeatures && (
          <FormControlLabel
            control={
              <Checkbox
                checked={advancedFeatures}
                onChange={(e) => setAdvancedFeatures(e.target.checked)}
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
              />
            }
            label={
              <Typography variant="body1" color="inherit">
                Enable Advanced Features
              </Typography>
            }
          />
        )}
        <Typography variant="h5" color="inherit">
          {contentTopBar}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
