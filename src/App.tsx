import { AppBar, Box, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { HomePage } from './pages/MainPage/HomePage';
import { A1 } from "./pages/Articles/A1"
import { A2 } from "./pages/Articles/A2"
import { A3 } from "./pages/Articles/A3"
import { A4 } from "./pages/Articles/A4"
import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<HomePage />}/>
        <Route path="/A1" element={<A1/>}/>
        <Route path="/A2" element={<A2/>}/>
        <Route path="/A3" element={<A3/>}/>
        <Route path="/A4" element={<A4/>}/>
      </Routes>
    </Router>
  );
}

export default App;
