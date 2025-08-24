import { Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthsService } from '../../services/authsService';
import styled from '@emotion/styled';
export function Login() {
  const redir = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function LoginButtonHandler() {
    const authsService = new AuthsService();
    const isLoginSuccess = await authsService.post({ email, password });
    if (isLoginSuccess) {
      redir('/home');
    } else {
      alert('wrong email or password');
    }
  }
  return (
    <LoginDialog>
      <Box style={{ fontSize: '30px', textAlign: 'center' }}>
        <h1>Log In</h1>
      </Box>

      <MyInputTextField
        variant="filled"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <MyInputTextField
        type="password"
        variant="filled"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={LoginButtonHandler}
        style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px' }}
      >
        Log In
      </button>
      <button
        onClick={() => redir('/home')}
        style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px' }}
      >
        Back
      </button>
    </LoginDialog>
  );
}

const LoginDialog = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MyInputTextField = styled(TextField)`
  & .MuiFilledInput-root {
    background-color: #e5e5e5;
    &:hover {
      background-color: #ddd;
    }
    &.Mui-focused {
      background-color: #cacaca;
    }
    border-radius: 6px;
  }
`;
