let loggedIn = false;
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export { loggedIn };
export function Login() {
    const redir = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function LoginButtonHandler() {
            try {
                const response = await fetch("http://localhost:3000/auth", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({email, password}),
                });
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const res = await response.json();
                if(!res.token) {
                    console.error('No token in response');
                    throw new Error('No token in response');
                }
                localStorage.setItem('token', res.token);
                loggedIn = true;
                redir('/home');
            } catch (error) {
                console.error(error);
                alert("error");
            }
      }
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
           
            <Box className="L1" style={{ fontSize: '30px', textAlign: 'center' }}>
                <h1>Log In</h1>
            </Box>

            <TextField 
            variant="filled" 
            label="Email" 
            sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#e5e5e5',
                  '&:hover': { backgroundColor: '#ddd' },
                  '&.Mui-focused': { backgroundColor: '#cacaca' },
                  borderRadius: 2,
                },
            }}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} />

            <TextField 
            variant="filled" 
            label="Password" 
            sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#e5e5e5',
                  '&:hover': { backgroundColor: '#ddd' },
                  '&.Mui-focused': { backgroundColor: '#cacaca' },
                  borderRadius: 2,
                },
            }}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} />

         <button onClick={LoginButtonHandler} style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px'}}>Log In</button>
        </Box>
    )
}
export async function tryTokenLogin() {
    const token = localStorage.getItem('token');
    if (!token) return false
    const tokenService = new TokenService();
    await tokenService.post(token);
    const validToken = await tokenService.get();
    if (validToken) {
        loggedIn = true;
        return true;
    }else{
        return false;
    }
}