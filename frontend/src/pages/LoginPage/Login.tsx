import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export function Login() {
    const redir = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function LoginButtonHandler() {
            try {
                const response = await fetch("http://localhost:3000/api/login", {
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
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
         <button onClick={LoginButtonHandler} style={{ fontSize: '20px', textAlign: 'center' }}>Log In</button>
        </Box>
    );
}