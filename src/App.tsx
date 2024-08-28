import { P1 } from './pages/TextPages/P1';
import { P2 } from './pages/TextPages/P2';
import { P3 } from './pages/TextPages/P3';
import { P4 } from './pages/TextPages/P4';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import './App.css';
import { HomePage } from './pages/HomePage/HomePage';
import { Box } from '@mui/material';

const App = () => {
  const header = <Box sx={{ height: '3em' }}>header</Box>;
  // TODO: refactor paths routes and pages to get them from single source
  return (
    <MainLayout header={header}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/P1" element={<P1 />} />
          <Route path="/P2" element={<P2 />} />
          <Route path="/P3" element={<P3 />} />
          <Route path="/P4" element={<P4 />} />
        </Routes>
      </Router>
    </MainLayout>
  );
};

export default App;
