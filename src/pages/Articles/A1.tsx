import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A1(){
    const redir = useNavigate();
    function Homeredir(){
        redir('/')
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Home</button>
            <Box className="A1" style={{fontSize:"40px"}}>
                1
            </Box>
        </Box>
    );
}