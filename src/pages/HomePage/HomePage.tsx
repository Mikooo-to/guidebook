import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export function HomePage() {
  const redir = useNavigate();
  function P1ButtonHandler() {
    redir('/P1');
  }
  function P2ButtonHandler() {
    redir('/P2');
  }
  function P3ButtonHandler() {
    redir('/P3');
  }
  function P4ButtonHandler() {
    redir('/P4');
  }
  return (
    <Box className="bg-image">
      <button onClick={P1ButtonHandler}>центри гуманітарної допомоги</button>
      <button onClick={P2ButtonHandler}>торгівельні центри та магазини</button>
      <button onClick={P3ButtonHandler}>пам’ятки та цікавинки</button>
      <button onClick={P4ButtonHandler}>відпочинок</button>
    </Box>
  );
}
