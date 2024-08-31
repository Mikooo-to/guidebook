import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { PageLinkBtn } from '../../components/PageLinkBtn/PageLinkBtn';
import { pagesPathsAndNames } from '../../const';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <HomePageContainer>
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

const HomePageContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-self: flex-start;
`;
