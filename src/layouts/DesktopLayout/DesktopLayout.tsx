import styled from '@emotion/styled';
import { ReactElement } from 'react';
import backgroundImage from '../../images/background-desktop.jpg';

const headerHeightPx = 50;

export type MainLayoutProps = {
  header: ReactElement;
  mainPart: ReactElement | ReactElement[];
};

export function DesktopLayout({ header, mainPart }: MainLayoutProps) {
  return (
    <GlobalContainer>
      <HeaderContainer>{header}</HeaderContainer>
      <MainContainer>{mainPart}</MainContainer>
    </GlobalContainer>
  );
}

const GlobalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: gray;
`;

const HeaderContainer = styled.div`
  height: ${headerHeightPx}px;
  width: 100%;
  background-color: aquamarine;
`;

const MainContainer = styled.div`
  height: calc(100vh - ${headerHeightPx}px);
  width: 100%;

  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: gray;

  display: flex;
  flex-direction: column;
`;
