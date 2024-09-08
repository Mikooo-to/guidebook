import { P1 } from './pages/TextPages/P1';
import { P2 } from './pages/TextPages/P2';
import { P3 } from './pages/TextPages/P3';
import { P4 } from './pages/TextPages/P4';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage/HomePage';
import { Box, useMediaQuery } from '@mui/material';
import { pagesPathsAndNames } from './const';
import { PhoneLayout } from './layouts/PhoneLayout/PhoneLayout';
import { DesktopLayout } from './layouts/DesktopLayout/DesktopLayout';

const App = () => {
  const isDesktopOrLaptop = useMediaQuery('(min-width: 1224px)');
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');
  // const isBigScreen = useMediaQuery('(min-width: 1824px)');
  // const isPortrait = useMediaQuery('(orientation: portrait)');
  // const isRetina = useMediaQuery('(min-resolution: 2dppx)');

  const header = (
    <Box>
      header <br />
      isTabletOrMobile:{String(isTabletOrMobile)}; isDesktopOrLaptop:
      {String(isDesktopOrLaptop)}
    </Box>
  );
  const rendredPages = (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={pagesPathsAndNames[0].path} element={<P1 />} />
        <Route path={pagesPathsAndNames[1].path} element={<P2 />} />
        <Route path={pagesPathsAndNames[2].path} element={<P3 />} />
        <Route path={pagesPathsAndNames[3].path} element={<P4 />} />
      </Routes>
    </Router>
  );
  const layout = isTabletOrMobile ? (
    <PhoneLayout header={header} mainPart={rendredPages} />
  ) : isDesktopOrLaptop ? (
    <DesktopLayout header={header} mainPart={rendredPages} />
  ) : (
    <>unknown media</>
  );

  return layout;
};

export default App;
