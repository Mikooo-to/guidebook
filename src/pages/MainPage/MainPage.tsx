import React, { useState } from 'react';
import { Box, Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, } from '@mui/material';

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
    <Box>

    <Box
      width="25%"
      display={'flex'}
      flexDirection={'column'}
      alignContent={'start'}
      marginTop={"20px"}
      marginBottom={"20px"}
      >
      <Box style={{ marginBottom: '10px' }}>{a}</Box>
        <Button style={{ marginBottom: '10px' }} variant="contained" onClick={btnHandlerA} sx={{ color: 'red' }}>
          +++
        </Button>
        <Button style={{ marginBottom: '20px' }} variant="contained" onClick={btnHandlerS} sx={{ color: 'red' }}>
          ---
        </Button>
        <TextField onChange={(e) => textFieldChangeHandler(e.target.value)}>
          asdfas
        </TextField>
    </Box>

    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
      aria-labelledby="demo-radio-buttons-group-label"
      defaultValue="female"
      name="radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
        </Box>
  );
}
