import mongoose from 'mongoose';

const forecastSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  temperatureUnit: {
    type: String,
    required: true,
    default: 'C',
  },
});

const Forecast = mongoose.model('Forecast', forecastSchema);

export { Forecast };
