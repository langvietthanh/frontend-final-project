import { useNavigate, Navigate } from "react-router-dom";
import { AppContext } from "../../context";
import { useContext } from "react";
import { use } from "react";

function ProtectedRoute({children}){
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const {credit} = useContext(AppContext);
    if( !token) return <Navigate to="/" replace/>
    return children;
}

export default ProtectedRoute;