import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { PageLinkBtn } from '../../components/PageLinkBtn/PageLinkBtn';
import { pagesPathsAndNames } from '../../const';
import { useMediaQuery } from '@mui/material';

export function HomePage() {
  const navigate = useNavigate();
  const isDesktopOrLaptop = useMediaQuery('(min-width: 1224px)');

  return (
    <HomePageContainer
      buttonsPosition={isDesktopOrLaptop ? 'flex-start' : 'flex-end'}
    >
      {pagesPathsAndNames.map((p) => (
        <PageLinkBtn
          key={p.path}
          text={p.linkText}
          onClick={() => navigate(p.path)}
        />
      ))}
    </HomePageContainer>
  );
}

const HomePageContainer = styled.div<{
  buttonsPosition: 'flex-start' | 'flex-end';
}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ buttonsPosition }) => buttonsPosition};
  justify-content: space-between;
`;