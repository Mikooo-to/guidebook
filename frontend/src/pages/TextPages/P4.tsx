import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function P4(){
    const redir = useNavigate();
    function BackButtonHandler(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={BackButtonHandler}>Back</button>
            <Box className="P4" style={{fontSize:"40px"}}>
                <h1>Page4 Content</h1>
            </Box>
        </Box>
    );
}