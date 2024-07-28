import{ Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';
export function A1(){
    const redir = useNavigate();
    function Homeredir(){
        redir(-1);
    }
    return(
        <Box>   
            <button onClick={Homeredir}>Back</button>
            <Box className="A1" style={{fontSize:"40px"}}>
                <h1>центри гуманітарної допомоги</h1>
            </Box>
        </Box>
    );
}