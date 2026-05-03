import './App.css';

import React, {useState} from "react";
import { Grid, Paper } from "@mui/material";
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
  Login
} from "./components";

import { AppContext } from './context';

const App = (props) => {
  const [contentTopBar, setContentTopBar] = useState("");
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [userPhotos, setUserPhotos] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [listUser, setListUser] = useState([]);

  const contextValue ={
    contentTopBar,
    setContentTopBar,
    advancedFeatures, 
    setAdvancedFeatures,
    token,
    setToken,
    user,
    setUser,
    userPhotos, 
    setUserPhotos,
    listUser,
    setListUser
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar/>
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper >
                <Routes>
                  <Route path="/" element={<Outlet />} >
                    <Route index element={<LoginRegister />} />
                    <Route path ="register" element={<Register />}/>
                    <Route path ="login" element={<Login />}/>
                  </Route>
                  <Route
                      path="/users/:userId"
                      element = {
                        <ProtectedRoute>
                          <UserDetail />
                        </ProtectedRoute>}
                  />
                  <Route
                      path="/photos/:userId"
                      element = {
                        <ProtectedRoute>
                          <UserPhotos />
                        </ProtectedRoute>}
                  />
                  <Route
                      path="/photos/:userId/:photoId"
                      element = {
                        <ProtectedRoute>
                          <UserPhotos />
                        </ProtectedRoute>}
                  />
                  <Route path="/users" element = {
                      <ProtectedRoute>
                      <UserList />
                    </ProtectedRoute>} />
                  <Route path="/comments/:userId" element = {
                      <ProtectedRoute>
                      <UserComment />
                    </ProtectedRoute>} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
