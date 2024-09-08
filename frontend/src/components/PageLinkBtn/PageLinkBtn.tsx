import styled from '@emotion/styled';
type PageLinkBtnProps = {
  text: string;
  styleOverride?: React.CSSProperties;
  onClick: () => void;
};

export function PageLinkBtn({
  text,
  onClick,
  styleOverride,
}: PageLinkBtnProps) {
  return (
    <PageLinkBtnContainer onClick={onClick} style={styleOverride}>
      {text}
    </PageLinkBtnContainer>
  );
}

const PageLinkBtnContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px 30px;
  padding-left: 70px;
  font-size: 20px;
  color: white;
  cursor: pointer;
`;
