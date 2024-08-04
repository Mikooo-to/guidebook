import { Box } from '@mui/material';
import { ReactElement } from 'react';

export type MainLayoutProps = {
  header: ReactElement;
  children: ReactElement | ReactElement[];
};

export function MainLayout({ header, children }: MainLayoutProps) {
  return (
    <Box sx={{ maxHeight: '100vh' }}>
      {header}
      {children}
    </Box>
  );
}
