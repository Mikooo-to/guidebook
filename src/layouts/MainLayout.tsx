import { Box } from '@mui/material';
import { ReactElement } from 'react';

const headerHeightPx = 50;

export type MainLayoutProps = {
  header: ReactElement;
  children: ReactElement | ReactElement[];
};

export function MainLayout({ header, children }: MainLayoutProps) {
  return (
    <Box>
      <Box sx={{ height: `${headerHeightPx}px` }}>{header}</Box>
      <Box sx={{ height: `calc(100vh - ${headerHeightPx}px)` }}>{children}</Box>
    </Box>
  );
}
