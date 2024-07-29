import { AppBar, Box, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { HomePage } from './pages/MainPage/HomePage';
import { P1 } from "./pages/TextPages/P1"
import { P2 } from "./pages/TextPages/P2"
import { P3 } from "./pages/TextPages/P3"
import { P4 } from "./pages/TextPages/P4"
import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/P1" element={<P1/>}/>
        <Route path="/P2" element={<P2/>}/>
        <Route path="/P3" element={<P3/>}/>
        <Route path="/P4" element={<P4/>}/>
      </Routes>
    </Router>
  );
}

export default App;
