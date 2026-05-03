import { useForm} from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

function Register(){
    const {register, handleSubmit, reset, formState:{errors}} = useForm();
    
    function onSubmit(data){
        // Kiểm tra mật khẩu có khớp nhau không
        if (data.password !== data.password_confirm) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try{
            console.log(data);
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
                    alert("Register success");
                    reset();
                } else {
                    const errorText = await res.text();
                    alert("Register fail" + errorText);
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
                        {...register("password", {required: "Please enter Password"})}
                        error={!!errors.password}
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
            </Paper>
        </Box>
    );
}

export default Register;
