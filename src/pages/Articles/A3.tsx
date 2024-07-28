import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A3(){
    const redir = useNavigate();
    function Homeredir(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Back</button>
            <Box className="A3" style={{fontSize:"40px"}}>
                <h1>пам’ятки та цікавинки</h1>
            </Box>
        </Box>
    );
}