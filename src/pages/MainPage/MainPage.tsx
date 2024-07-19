import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

export function MainPage() {
  let [a, setA] = useState(0);

  function btnHandlerA() {
    a++;
    setA(a);
  }

  function btnHandlerS() {
    a--;
    setA(a);
  }

  function textFieldChangeHandler(v: string) {
    console.log(v);
    setA(Number(v));
  }

  return (
    <Box
      width="25%"
      display={'flex'}
      flexDirection={'column'}
      alignContent={'start'}
    >
      <Box>{a}</Box>
        <Button variant="contained" onClick={btnHandlerA} sx={{ color: 'red' }}>
          +++
        </Button>
        <Button variant="contained" onClick={btnHandlerS} sx={{ color: 'red' }}>
          ---
        </Button>
        <TextField onChange={(e) => textFieldChangeHandler(e.target.value)}>
          asdfas
        </TextField>
    </Box>
  );
}
