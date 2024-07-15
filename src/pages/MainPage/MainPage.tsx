import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

export function MainPage() {
  let [a, setA] = useState(0);

  function btnHandler() {
    a++;
    setA(a);
  }

  function textFieldChangeHandler(v: string) {
    console.log(v);
    setA(Number(v));
  }

  return (
    <Box
      width="100%"
      display={'flex'}
      flexDirection={'column'}
      alignContent={'start'}
    >
      <p>{a}</p>
      <p>
        <Button variant="contained" onClick={btnHandler} sx={{ color: 'red' }}>
          +++
        </Button>
      </p>
      <p>
        <TextField onChange={(e) => textFieldChangeHandler(e.target.value)}>
          asdfas
        </TextField>
      </p>
    </Box>
  );
}
