import { AppBar, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { MainPage } from "./pages/MainPage/MainPage";

function App() {
  
 
  return (
    <Grid>
      <AppBar position="static" sx={{ marginBottom: '5px' }}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Some cool text
          </Typography>
        </Toolbar>
      </AppBar>
      <MainPage></MainPage>
    </Grid>
  );  
}

export default App;
