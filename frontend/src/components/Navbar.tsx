import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#FG1111', width : '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            Welcome
          </Link>
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/upload"
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              textTransform: 'none',
            }}
          >
            Upload Video
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;