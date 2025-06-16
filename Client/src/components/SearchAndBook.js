import React, { useState } from 'react';
import {
  TextField, Button, Typography, Container, Paper,
  Snackbar, Alert, Grid, Card, CardContent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import API from '../api';

const SearchAndBook = () => {
  const [form, setForm] = useState({ capacityRequired: '', fromPincode: '', toPincode: '' });
  const [startTime, setStartTime] = useState(new Date());
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const res = await API.get('/vehicles/available', {
        params: { ...form, startTime: startTime.toISOString() },
      });
      setVehicles(res.data);
    } catch (err) {
      setMessage('Error fetching vehicles.');
      setOpen(true);
    }
  };

  const handleBook = async (vehicleId) => {
    try {
      await API.post('/bookings', {
        vehicleId,
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: startTime.toISOString(),
        capacityRequired: form.capacityRequired,
        customerId: 'customer123',
      });
      setMessage('Booking successful!');
      setOpen(true);
    } catch (err) {
      setMessage('Booking failed or vehicle unavailable.');
      setOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h5" gutterBottom color="primary">Search & Book Vehicle</Typography>

          <TextField
            label="Required Capacity (kg)"
            name="capacityRequired"
            value={form.capacityRequired}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="From Pincode"
            name="fromPincode"
            value={form.fromPincode}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="To Pincode"
            name="toPincode"
            value={form.toPincode}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSearch}
            sx={{ mt: 2 }}
          >
            Search Availability
          </Button>
        </Paper>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {vehicles.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v._id}>
              <Card elevation={2} sx={{ bgcolor: '#f1f1f1' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">{v.name}</Typography>
                  <Typography>Capacity: {v.capacityKg} kg</Typography>
                  <Typography>Tyres: {v.tyres}</Typography>
                  <Typography>Ride Duration: {v.estimatedRideDurationHours} hrs</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleBook(v._id)}
                    sx={{ mt: 1 }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        >
          <Alert severity="info">{message}</Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default SearchAndBook;
