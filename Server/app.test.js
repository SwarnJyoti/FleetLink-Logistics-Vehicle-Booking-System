const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/fleetlink_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Vehicle.deleteMany();
  await Booking.deleteMany();
});

describe('POST /api/vehicles', () => {
  it('should add a vehicle successfully', async () => {
    const res = await request(app).post('/api/vehicles').send({
      name: 'Truck A',
      capacityKg: 1500,
      tyres: 6
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Truck A');
  });
});

describe('GET /api/vehicles/available', () => {
  it('should return available vehicle if no overlapping booking and sufficient capacity', async () => {
    const vehicle = await Vehicle.create({ name: 'Truck B', capacityKg: 3000, tyres: 10 });

    const res = await request(app).get('/api/vehicles/available').query({
      fromPincode: '100000',
      toPincode: '100100', 
      capacityRequired: 2000,
      startTime: new Date().toISOString()
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(vehicle._id.toString());
    expect(res.body[0].estimatedRideDurationHours).toBe(4);
  });

  it('should not return a vehicle if capacity is insufficient', async () => {
    await Vehicle.create({ name: 'Mini Truck', capacityKg: 1000, tyres: 4 });

    const res = await request(app).get('/api/vehicles/available').query({
      fromPincode: '100000',
      toPincode: '100100',
      capacityRequired: 2000,
      startTime: new Date().toISOString()
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe('POST /api/bookings', () => {
  it('should book a vehicle if available in given slot', async () => {
    const vehicle = await Vehicle.create({ name: 'Truck C', capacityKg: 2500, tyres: 8 });

    const res = await request(app).post('/api/bookings').send({
      vehicleId: vehicle._id.toString(),
      fromPincode: '200000',
      toPincode: '200048', 
      startTime: new Date().toISOString(),
      customerId: 'cust123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.vehicleId).toBe(vehicle._id.toString());
  });

  it('should prevent booking if time overlaps with existing booking', async () => {
    const vehicle = await Vehicle.create({ name: 'Truck D', capacityKg: 2500, tyres: 8 });
    const now = new Date();
    const end = new Date(now.getTime() + 4 * 60 * 60 * 1000); 

    await Booking.create({
      vehicleId: vehicle._id,
      fromPincode: '300000',
      toPincode: '300100', 
      startTime: now,
      endTime: end,
      customerId: 'cust999'
    });

    const res = await request(app).post('/api/bookings').send({
      vehicleId: vehicle._id.toString(),
      fromPincode: '300000',
      toPincode: '300100',
      startTime: now.toISOString(),
      customerId: 'cust777'
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Vehicle already booked during this time');
  });
});
