import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A3(){
    const redir = useNavigate();
    function Homeredir(){
        redir('/Home')
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Home</button>
            <Box className="A3" style={{fontSize:"40px"}}>
                3
            </Box>
        </Box>
    );
}