import React, { useState } from 'react';
import { Box, Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Slider } from '@mui/material';
import redtpot from '../../images/redtpot.png';
import blacktpot from '../../images/blacktpot.png';
import greytpot from '../../images/greytpot.png';
import whitetpot from '../../images/whitetpot.png';
import greentpot from '../../images/greentpot.png';
import bluetpot from '../../images/bluetpot.png';
import yellowtpot from '../../images/yellowtpot.png';
import { yellow } from '@mui/material/colors';

export function MainPage() {
  let [a, setA] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string>(redtpot);
  function btnHandlerA() {
    a++;
    setA(a);
  }

  function btnHandlerS() {
    if(a != 0){
      a--;
    }
    setA(a);
  }

  function msgShow(){
  }

  function textFieldChangeHandler(v: string) {
    if(Number(v) >= 0){
      setA(Number(v));
    }
  }


  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>){
    const value = event.target.value;
    switch (value) {
      case 'White':
        setSelectedImage(whitetpot);
        console.log("blah");
        break;
      case 'Black':
        setSelectedImage(blacktpot);
      break;
      case 'Grey':
        setSelectedImage(greytpot);
      break;
      case 'Red':
        setSelectedImage(redtpot);
        break;
      case 'Green':
        setSelectedImage(greentpot);
      break;
      case 'Yellow':
        setSelectedImage(yellowtpot);
      break;
      case 'Blue':
        setSelectedImage(bluetpot);
      break;
      default:
        setSelectedImage(redtpot);
      break;
    }
  };

  return (
    <Box style={{ marginLeft: '30px'}}>
      <img src={selectedImage} alt="Teapot" style={{ width: "500px" }} />

      <Box
        width="25%"
        display={'flex'}
        flexDirection={'column'}
        alignContent={'start'}
        marginTop={"20px"}
        marginBottom={"20px"}
      >
        <Box style={{ marginBottom: '10px' , fontSize: "20px" }}>Amount:</Box>

        <Box style={{ marginBottom: '10px' , fontSize: "20px"}}>{a}</Box>

          <Button style={{ marginBottom: '10px' }} variant="contained" onClick={btnHandlerA} sx={{ color: 'white' , fontSize: "20px"}}>
            +++
          </Button>
          <Button style={{ marginBottom: '20px' }} variant="contained" onClick={btnHandlerS} sx={{ color: 'white' , fontSize: "20px"}}>
              ---
          </Button>
          <TextField onChange={(e) => textFieldChangeHandler(e.target.value)} variant="standard">
            asdfas
          </TextField>
      </Box>

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label" sx={{fontSize: "20px" , marginBottom: "10px"}}>Color</FormLabel>
          <RadioGroup sx={{ marginBottom: "20px"}}
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={handleImageChange}
          >
          <FormControlLabel value="White" control={<Radio />} label="White" sx={{ color: "black" }}/>
          <FormControlLabel value="Black" control={<Radio />} label="Black" sx={{ color: "black" }}/>
          <FormControlLabel value="Grey" control={<Radio />} label="Grey" sx={{ color: "grey" }}/>
          <FormControlLabel value="Red" control={<Radio />} label="Red" sx={{ color: "red" }}/>
          <FormControlLabel value="Yellow" control={<Radio />} label="Yellow" sx={{ color: yellow[600] }}/>
          <FormControlLabel value="Green" control={<Radio />} label="Green" sx={{ color: "green" }}/>
          <FormControlLabel value="Blue" control={<Radio />} label="Blue" sx={{ color: "blue" }}/>
        </RadioGroup>
      </FormControl>
      <Box sx={{fontSize: '20px'}}>
        Size(ml)
        <Box sx={{marginBottom: '20px'}}/>
        <Slider sx={{ width: '300px'}}
          aria-label="Size(ml)"
          defaultValue={200}
          shiftStep={0}
          step={100}
          min={200}
          max={500}
          valueLabelDisplay="on"
        />
      </Box>

      <Button style={{ marginLeft: '45%' }} variant="contained" sx={{ color: 'white' , fontSize: "20px"}} onClick={msgShow}>
            Order
      </Button>
    </Box>
  );
}
