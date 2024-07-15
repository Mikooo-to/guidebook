import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

function App() {
  let [a, setA ] = useState(0)
  
  function btnHandler() {
    a++
    setA(a)
  }
  
  function textFieldChangeHandler(v:string) {
    console.log(v)
    setA(Number(v))
  }
  
  
  return (
    <Box sx={{border:'solid black 1px'}}>
      <p>{a}</p>
        <Button variant="contained" onClick={btnHandler} sx={{color: 'red' }}>+++</Button>
      <p>
        <TextField onChange={(e) => textFieldChangeHandler(e.target.value)}>asdfas</TextField>
      </p>
    </Box>
  );
}

export default App;
