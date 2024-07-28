import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { TextWithBackground } from '../../components/TextWithBackground/TextWithBackground';
import { useNavigate } from 'react-router-dom';
//import background from 'c:\Users\User\Downloads\background.jpg'
export function HomePage(){
  const redir = useNavigate();
  function A1redir(){
    redir('/A1')
  }
  function A2redir(){
    redir('/A2')
  }
  function A3redir(){
    redir('/A3')
  }
  function A4redir(){
    redir('/A4')
  }
  return ( 
  <Box className="bg-cover">
   <Box className="bg-image">
      <Box className="button-container">
        <button onClick={A1redir}>A1</button>
        <button onClick={A2redir}>A2</button>
        <button onClick={A3redir}>A3</button>
        <button onClick={A4redir}>A4</button>
      </Box>
    </Box>
      <TextWithBackground
        text='asdfasdf'
      />
    </Box>

    
   

  );
   
}
