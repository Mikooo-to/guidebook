import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

export function MainPage() {
  let [a, setA] = useState(0);

  function btnHandler() {
    a++;
    setA(a);
  }

  function textFieldChangeHandler(v: string): void {
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
      <Box>
        {a}-{a}
      </Box>
      <Button variant="contained" onClick={btnHandler} sx={{ color: 'red' }}>
        +++
      </Button>
      <TextField
        onChange={(e) => {
          textFieldChangeHandler(e.target.value);
        }}
      ></TextField>
    </Box>
  );
}
