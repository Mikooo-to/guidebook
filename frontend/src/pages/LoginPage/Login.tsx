import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
export function Login() {
    const redir = useNavigate();
    function LoginButtonHandler() {
        redir('/home');    // Change later, redirect to HomePage for now.
      }
    return (
        <Box>
            <button onClick={LoginButtonHandler}>Log In</button>
            <Box className="L1" style={{ fontSize: '40px' }}>
                <h1>Log In</h1>
            </Box>
        </Box>
    );
}