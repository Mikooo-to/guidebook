import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/background.jpg';
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
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'black',
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
      }}
    >
      <button
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '15px 30px',
          paddingLeft: '70px',
          fontSize: '20px',
          color: 'white',
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
        onClick={P1ButtonHandler}
      >
        центри гуманітарної допомоги
      </button>
      <button onClick={P2ButtonHandler}>торгівельні центри та магазини</button>
      <button onClick={P3ButtonHandler}>пам’ятки та цікавинки</button>
      <button onClick={P4ButtonHandler}>відпочинок</button>
    </Box>
  );
}
