import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { AppContext } from "../../context";

function Register(){
    const {register, handleSubmit, reset, formState:{errors}} = useForm();
    const [passRegister, setPassRegister] = useState(false);
    const navigate = useNavigate();
    const { setSnackbar } = useContext(AppContext);

    function onSubmit(data){
        if (data.password !== data.password_confirm) {
            setSnackbar({ open: true, message: "Mật khẩu xác nhận không khớp!", severity: 'error' });
            return;
        }
        try{
            const fetchData = async () => {
                const res = await fetch("http://localhost:8081/api/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        login_name: data.login_name,
                        password: data.password,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        location: data.location,
                        description: data.description,
                        occupation: data.occupation
                    })  
                });

                if (res.ok) {
                    setSnackbar({ open: true, message: "Register success", severity: 'success' });
                    setPassRegister(true);
                    reset();
                } else {
                    const errorText = await res.text();
                    setSnackbar({ open: true, message: "Register fail " + errorText, severity: 'error' });
                }
            }
            fetchData();
        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4} mb={4}>
            <Paper sx={{ padding: 4, width: '400px' }}>
                <Typography variant="h5" textAlign="center">
                    Register
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Login Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("login_name", {required: "Please enter Login Name"})}
                        error={!!errors.login_name}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("password", {
                            required: "Please enter Password",
                            minLength: {
                                value: 8,
                                message: "Mật khẩu phải có ít nhất 8 ký tự"
                            },
                            pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d).*$/,
                                message: "Mật khẩu phải bao gồm cả chữ và số"
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("password_confirm", {required: "Vui lòng xác nhận Password"})}
                        error={!!errors.password_confirm}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("first_name", {required: "Please enter First Name"})}
                        error={!!errors.first_name}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("last_name", {required: "Please enter Last Name"})}
                        error={!!errors.last_name}
                    />
                    <TextField
                        label="Location"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("location")}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("description")}
                    />
                    <TextField
                        label="Occupation"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        {...register("occupation")}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Register Me
                    </Button>
                </form>
                {passRegister && <Button onClick={() => navigate("/login")} variant="contained" fullWidth sx={{ mt: 2 }}>Go to Login</Button>}
            </Paper>
        </Box>
    );
}

export default Register;
