import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A4(){
    const redir = useNavigate();
    function Homeredir(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Back</button>
            <Box className="A4" style={{fontSize:"40px"}}>
                <h1>відпочинок</h1>
            </Box>
        </Box>
    );
}