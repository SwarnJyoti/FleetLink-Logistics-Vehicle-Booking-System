import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import theme from './theme';
import AddVehicle from './components/AddVehicle';
import SearchAndBook from './components/SearchAndBook';

const App = () => {
  const [tab, setTab] = React.useState(0);

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">FleetLink-Logistics Vehicle Booking System</Typography>
        </Toolbar>
      </AppBar>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="Add Vehicle" />
        <Tab label="Search & Book" />
      </Tabs>
      <Box p={2}>
        {tab === 0 && <AddVehicle />}
        {tab === 1 && <SearchAndBook />}
      </Box>
    </ThemeProvider>
  );
};

export default App;





