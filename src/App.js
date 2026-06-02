import './App.css';

import { useState } from "react";
import { Grid, Paper, Box, Snackbar, Alert } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

import {
  TopBar,
  UserDetail,
  UserList,
  UserPhotos,
  UserComment,
  ProtectedRoute,
  LoginRegister,
  Register,
  Login,
  UserNotes
} from "./components";

import { AppContext } from './context';

const App = (props) => {
  const [contentTopBar, setContentTopBar] = useState("");
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [userPhotos, setUserPhotos] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: '' });
  const [listUser, setListUser] = useState([]);
  
  const contextValue = {
    contentTopBar,
    setContentTopBar,
    advancedFeatures,
    setAdvancedFeatures,
    userPhotos,
    setUserPhotos,
    token,
    setToken,
    user,
    setUser,
    snackbar,
    setSnackbar,
    listUser,
    setListUser,
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  }

  // Phân tách Layout khi chưa đăng nhập (Public Routes)
  const unauthRoutes = (
    <Grid item xs={12}>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<LoginRegister />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Grid>
  );

  // Phân tách Layout khi đã đăng nhập (Protected Routes & Sidebar chứa UserList)
  const authLayout = (
    <>
      <Grid item sm={3}>
        <Paper >
          <UserList />
        </Paper>
      </Grid>
      <Grid item sm={9}>
        <Paper>
          <Routes>
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/users/:userId" element={<UserDetail />} />
              <Route path="/photos/:userId" element={<UserPhotos />} />
              <Route path="/photos/:userId/:photoId" element={<UserPhotos />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/comments/:userId" element={<UserComment />} />
              <Route path="/notes" element={<UserNotes />} />
            </Route>
          </Routes>
        </Paper>
      </Grid>
    </>
  );

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <Grid container spacing={2}>
          {/* Header (Luôn hiển thị) */}
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          
          {/* Các Layout thay đổi dựa trên Auth State */}
          {unauthRoutes}
          {token && authLayout}
        </Grid>
      </Router> 
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}

export default App;
