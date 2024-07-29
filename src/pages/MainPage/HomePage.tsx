import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { TextWithBackground } from '../../components/TextWithBackground/TextWithBackground';
import { useNavigate } from 'react-router-dom';
//import title from '../../images/title.jpg';
//import background from 'c:\Users\User\Downloads\background.jpg'
export function HomePage(){
  const redir = useNavigate();
  function P1ButtonHandler(){
    redir('/P1')
  }
  function P2ButtonHandler(){
    redir('/P2')
  }
  function P3ButtonHandler(){
    redir('/P3')
  }
  function P4ButtonHandler(){
    redir('/P4')
  }
  return ( 
      <Box className="bg-cover">
        <Box className="bg-image">
          <Box className="button-container">
            <button onClick={P1ButtonHandler}>центри гуманітарної допомоги</button>
            <button onClick={P2ButtonHandler}>торгівельні центри та магазини</button>
            <button onClick={P3ButtonHandler}>пам’ятки та цікавинки</button>
            <button onClick={P4ButtonHandler}>відпочинок</button>
          </Box>
        </Box>
      </Box>
  );
}
