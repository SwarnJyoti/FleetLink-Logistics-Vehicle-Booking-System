const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const calculateRideDuration = require('../utils/calculateDuration');

exports.getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    const start = new Date(startTime);
    const duration = calculateRideDuration(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired } });

    const availableVehicles = [];

    for (const vehicle of vehicles) {
      const overlappingBooking = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
      });

      if (!overlappingBooking) {
        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: duration
        });
      }
    }

    res.json(availableVehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const start = new Date(startTime);
    const duration = calculateRideDuration(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const overlappingBooking = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({ message: 'Vehicle already booked during this time' });
    }

    const booking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
