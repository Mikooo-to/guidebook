import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function P3(){
    const redir = useNavigate();
    function BackButtonHandler(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={BackButtonHandler}>Back</button>
            <Box className="P3" style={{fontSize:"40px"}}>
                <h1>пам’ятки та цікавинки</h1>
            </Box>
        </Box>
    );
}