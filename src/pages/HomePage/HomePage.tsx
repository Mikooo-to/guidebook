import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/background.jpg';
import styled from '@emotion/styled';
import { PageLinkBtn } from '../../components/PageLinkBtn/PageLinkBtn';

// TODO: refactor paths routes and pages to get them from single source

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
    <HomePageContainer>
      {pages.map((p) => (
        <PageLinkBtn
          key={p.path}
          text={p.text}
          onClick={() => navigate(p.path)}
          styleOverride={{ alignSelf: 'flex-end' }}
        />
      ))}
    </HomePageContainer>
  );
}

const HomePageContainer = styled.div`
  background-image: url(${backgroundImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  justify-content: space-between;
  align-self: flex-start;
`;
