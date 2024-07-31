import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function P2(){
    const redir = useNavigate();
    function BackButtonHandler(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={BackButtonHandler}>Back</button>
            <Box className="P2" style={{fontSize:"40px"}}>
                <h1>торгівельні центри та магазини</h1>
            </Box>
        </Box>
    );
}