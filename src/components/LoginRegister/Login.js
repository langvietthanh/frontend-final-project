import React, { useContext } from "react";
import { useForm} from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context";

function Login(){
    const {register, handleSubmit, formState:{errors}} = useForm();
    const navigate = useNavigate();
    const { setToken, setUser, setSnackbar } = useContext(AppContext);
    
    function onSubmit(data){
        try{
            const fetchData = async () => {
                const res = await fetch("https://34dct4-8081.csb.app/admin/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ login_name: data.username, password: data.password })  
                });
                
                if (res.ok) {
                    const result = await res.json();
                    localStorage.setItem("token", result.token); 
                    localStorage.setItem("user", JSON.stringify(result));
                    setToken(result.token);
                    setUser(result);
                    setSnackbar({open: true, message: `Login success` , severity: "success"});
                    navigate(`/users/${result._id}`);
                } else {
                    const result = await res.json();
                    setSnackbar({open: true, message: `Login failed: ${result.message}` , severity: "error"})
                }
            }
            fetchData();
        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <Paper sx={{ padding: 4, width: '300px' }}>
                <Typography variant="h5" textAlign="center">
                    Login
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="User name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register("username", {required: "User name is required"})}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register("password", {required: "Password is required"})}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;