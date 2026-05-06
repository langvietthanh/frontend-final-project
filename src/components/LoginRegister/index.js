import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";

function LoginRegister(){
    const navigate = useNavigate();
    return(
        <Box display="flex" gap={2} justifyContent="center" mt={4} padding={3}>
            <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="outlined" onClick={()=> navigate('/register')}>Register</Button>
        </Box>
    )
}

export default LoginRegister;