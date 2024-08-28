import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/background.jpg';

const pages = [
  {
    path: '/P1',
    text: 'центри гуманітарної допомоги',
  },
  {
    path: '/P2',
    text: 'торгівельні центри та магазини',
  },
  {
    path: '/P3',
    text: 'пам’ятки та цікавинки',
  },
  {
    path: '/P4',
    text: 'відпочинок',
  },
];

export function HomePage() {
  const navigate = useNavigate();

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
      {pages.map((p) => (
        <>
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
            onClick={() => navigate(p.path)}
          >
            {p.text}
          </button>
        </>
      ))}
    </Box>
  );
}
