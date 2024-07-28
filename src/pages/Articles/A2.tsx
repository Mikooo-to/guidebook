import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A2(){
    const redir = useNavigate();
    function Homeredir(){
        redir('/')
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Home</button>
            <Box className="A2" style={{fontSize:"40px"}}>
                2
            </Box>
        </Box>
    );
}