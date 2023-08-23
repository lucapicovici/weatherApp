import express, { Request, Response } from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { Forecast } from '../models/forecast';

require('dotenv').config({
  path: path.join(__dirname, 'config', '.env'),
});

const app = express();
const port = 3001;
const baseUrl = 'https://api.weather.gov/';
const MONGO_URI =
  process.env.DEV === 'production'
    ? process.env.MONGO_URI!
    : 'mongodb://localhost:27017/weatherApp';

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

async function getForecast(city: string, lat: number, lng: number) {
  const response = await axios.get(`${baseUrl}/points/${lat},${lng}`);
  const forecastLink = response.data.properties.forecast;

  const responseForecast = await axios.get(forecastLink);
  const periods = responseForecast.data.properties.periods;

  for (const period of periods) {
    if (period.isDaytime === true) {
      await Forecast.create({
        location: city,
        name: period.name,
        date: period.startTime.split('T')[0],
        temperature: (((period.temperature - 32) * 5) / 9).toFixed(1),
      });
    }
  }

  const forecast = await Forecast.find({ location: city });

  return forecast;
}

app.get('/api/forecast', async (req: Request, res: Response) => {
  try {
    await Forecast.deleteMany({});

    const houstonData = await getForecast('Houston', 29.7604, -95.3698);
    const newYorkData = await getForecast('New York', 40.7128, -74.006);

    res.json({
      houston: houstonData,
      newYork: newYorkData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(
      process.env.DEV === 'production'
        ? 'Connected to MongoDB Atlas!'
        : 'Connected to local MongoDB!'
    );

    await Forecast.deleteMany({});
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(
      `Server is running on port ${port} in ${process.env.DEV} environment`
    );
  });
};

start();
