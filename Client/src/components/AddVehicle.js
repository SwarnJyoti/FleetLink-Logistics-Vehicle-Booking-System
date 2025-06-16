import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';
import API from '../api';

const AddVehicle = () => {
  const [vehicle, setVehicle] = useState({ name: '', capacityKg: '', tyres: '' });
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post('/vehicles', vehicle);
      setMessage({ open: true, text: 'Vehicle added successfully!', severity: 'success' });
      setVehicle({ name: '', capacityKg: '', tyres: '' });
    } catch (err) {
      setMessage({ open: true, text: 'Error adding vehicle.', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Add Vehicle</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Vehicle Name"
          name="name"
          value={vehicle.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Capacity (kg)"
          name="capacityKg"
          type="number"
          value={vehicle.capacityKg}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Number of Tyres"
          name="tyres"
          type="number"
          value={vehicle.tyres}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
          Add Vehicle
        </Button>
      </Paper>
      <Snackbar open={message.open} autoHideDuration={3000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert severity={message.severity}>{message.text}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AddVehicle;



