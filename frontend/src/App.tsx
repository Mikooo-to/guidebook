import { ShowArticlesPage } from './pages/TextPages/ShowArticles';
import { AddArticlesPage } from './pages/TextPages/AddArticle';
import { AddSectionPage } from './pages/TextPages/AddSection';
import { Login } from './pages/LoginPage/Login';
import { P4 } from './pages/TextPages/P4';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path={pagesPathsAndNames[0].path}
          element={<ShowArticlesPage />}
        />
        <Route
          path={pagesPathsAndNames[1].path}
          element={<AddArticlesPage />}
        />
        <Route path={pagesPathsAndNames[2].path} element={<AddSectionPage />} />
        <Route path={pagesPathsAndNames[3].path} element={<Login />} />
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
