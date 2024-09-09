import styled from '@emotion/styled';
import { ReactElement } from 'react';
import backgroundImage from '../../images/background-phone.jpg';

const headerHeightPx = 50;

export type MainLayoutProps = {
  header: ReactElement;
  mainPart: ReactElement | ReactElement[];
};

export function PhoneLayout({ header, mainPart }: MainLayoutProps) {
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
  align-items: center;
  background-color: black;
`;

const HeaderContainer = styled.div`
  height: ${headerHeightPx}px;
  width: 100%;
  background-color: wheat;
`;

const MainContainer = styled.div`
  height: calc(100vh - ${headerHeightPx}px);
  width: 100%;

  background-image: url(${backgroundImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: gray;

  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;
