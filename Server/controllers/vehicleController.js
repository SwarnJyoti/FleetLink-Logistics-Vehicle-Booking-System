const Vehicle = require('../models/Vehicle');

exports.addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const vehicle = new Vehicle({ name, capacityKg, tyres });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};























