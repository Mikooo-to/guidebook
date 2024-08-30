import { P1 } from './pages/TextPages/P1';
import { P2 } from './pages/TextPages/P2';
import { P3 } from './pages/TextPages/P3';
import { P4 } from './pages/TextPages/P4';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import './App.css';
import { HomePage } from './pages/HomePage/HomePage';
import { Box } from '@mui/material';
import { pagesPathsAndNames } from './const';

const App = () => {
  const header = <Box sx={{ height: '3em' }}>header</Box>;
  return (
    <MainLayout header={header}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={pagesPathsAndNames[0].path} element={<P1 />} />
          <Route path={pagesPathsAndNames[1].path} element={<P2 />} />
          <Route path={pagesPathsAndNames[2].path} element={<P3 />} />
          <Route path={pagesPathsAndNames[3].path} element={<P4 />} />
        </Routes>
      </Router>
    </MainLayout>
  );
};

export default App;
