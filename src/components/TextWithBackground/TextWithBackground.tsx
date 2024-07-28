import { Box, TextareaAutosize } from "@mui/material";

export type TTextWithBackgroundProps= {
    text:string;
}

export function TextWithBackground(props:TTextWithBackgroundProps){
    return ( 
        <Box sx={{backgroundColor: 'red', margin: '3em'}}>
            {props.text}
        </Box>
    );
  }
  