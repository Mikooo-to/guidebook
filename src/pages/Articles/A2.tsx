import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A2(){
    const redir = useNavigate();
    function Homeredir(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Back</button>
            <Box className="A2" style={{fontSize:"40px"}}>
                <h1>торгівельні центри та магазини</h1>
            </Box>
        </Box>
    );
}