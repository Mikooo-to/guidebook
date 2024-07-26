import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { TextWithBackground } from '../../components/TextWithBackground/TextWithBackground';
//import background from 'c:\Users\User\Downloads\background.jpg'
export function MainPage(){
  return ( 
   <Box className="bg-image">
      <Box className="button-container">
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
        <button>Button 4</button>
      </Box>
      <TextWithBackground
        text='asdfasdf'
      />
    </Box>
  );
}
