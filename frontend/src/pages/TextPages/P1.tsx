import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function P1(){
    const redir = useNavigate(); 
    function BackButtonHandler(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={BackButtonHandler}>Back</button>
            <Box className="P1" style={{fontSize:"40px"}}>
                <h1>центри гуманітарної допомоги</h1>
            </Box>
        </Box>
    );
}