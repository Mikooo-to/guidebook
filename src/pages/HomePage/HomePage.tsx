import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/background.jpg';
import styled from '@emotion/styled';
import { PageLinkBtn } from '../../components/PageLinkBtn/PageLinkBtn';
import { pagesPathsAndNames } from '../../const';

// TODO: refactor paths routes and pages to get them from single source

export function HomePage() {
  const navigate = useNavigate();

  return (
    <HomePageContainer>
      {pagesPathsAndNames.map((p) => (
        <PageLinkBtn
          key={p.path}
          text={p.linkText}
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
