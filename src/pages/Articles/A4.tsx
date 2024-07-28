import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A4(){
    const redir = useNavigate();
    function Homeredir(){
        redir('/')
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Home</button>
            <Box className="A4" style={{fontSize:"40px"}}>
                4
            </Box>
        </Box>
    );
}