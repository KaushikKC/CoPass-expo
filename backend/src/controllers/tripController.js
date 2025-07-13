import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  const trip = await Trip.create({ ...req.body, owner: req.user.id });
  res.json(trip);
};

export const getTrips = async (req, res) => {
  const trips = await Trip.find({ owner: req.user.id });
  res.json(trips);
};
