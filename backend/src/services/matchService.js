import Trip from "../models/Trip.js";

export const suggestedMatches = async (userTrip) => {
  return Trip.find({
    location: userTrip.location,
    "dates.start": { $lte: userTrip.dates.end },
    "dates.end": { $gte: userTrip.dates.start },
    purpose: userTrip.purpose,
    owner: { $ne: userTrip.owner },
  });
};
