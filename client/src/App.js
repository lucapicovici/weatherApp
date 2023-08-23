import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { ForecastChart } from './Chart';

function App() {
  const [forecast, setForecast] = useState({});
  const [location, setLocation] = useState('houston');
  const [loading, setLoading] = useState(true);
  const [averageTemperature, setAverageTemperature] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:3001/forecast')
      .then((response) => {
        setForecast(response.data);
        setLoading(false);

        const locationForecast = response.data[location];

        // Check if forecast data is available
        if (locationForecast && locationForecast.length >= 2) {
          const currentDay = locationForecast[0];

          const currentTemperature = currentDay.temperature;
          const previousTemperature = 10;

          // Check temperature difference and trigger console log if necessary
          if (currentTemperature - previousTemperature > 2) {
            logTemperatureAlert(
              currentDay.date,
              currentTemperature,
              previousTemperature
            );
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [location]);

  useEffect(() => {
    // Calculate average temperature from historical data
    if (forecast[location]) {
      const temperatures = forecast[location].map((day) => day.temperature);
      const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
      const avg = (sum / temperatures.length).toFixed(1);
      setAverageTemperature(avg);
    }
  }, [forecast, location]);

  // Log temperature alert to console
  function logTemperatureAlert(date, currentTemp, previousTemp) {
    console.log(`Temperature alert:
      Location: ${location}
      Date: ${date}
      Current Temperature: ${currentTemp} °C
      Previous Temperature: ${previousTemp} °C`);
  }

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) =>
    Number(((celsius * 9) / 5 + 32).toFixed(1));

  // Extract chart data from the forecast state
  const chartData = forecast[location]?.map((day) => [
    day.name,
    isCelsius ? day.temperature : celsiusToFahrenheit(day.temperature),
  ]);

  return (
    <div className="App">
      <div className="container">
        <div className="title">
          <h1>Forecast App</h1>
          <hr></hr>
        </div>
        <div className="location">
          Select location
          <select
            className="form-select"
            aria-label="Default select example"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="houston">Houston</option>
            <option value="newYork">New York</option>
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {forecast[location].map((day, idx) => (
                  <tr key={idx + 1}>
                    <th scope="row">{idx + 1}</th>
                    <td>{day.name}</td>
                    <td>{day.date}</td>
                    <td>
                      {isCelsius
                        ? `${day.temperature} °C`
                        : `${celsiusToFahrenheit(day.temperature)} °F`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ForecastChart
              dataProp={[
                ['Name', isCelsius ? 'Temperature °C' : 'Temperature °F'],
                ...chartData,
              ]}
            />
            <div className="avgTemperature">
              <h3>
                Average temperature for the next 7 days:{' '}
                {isCelsius
                  ? `${averageTemperature} °C`
                  : `${celsiusToFahrenheit(averageTemperature)} °F`}
              </h3>
              <button
                type="button"
                className="btn btn-primary"
                onClick={toggleTemperatureUnit}
              >
                Convert to {isCelsius ? 'Fahrenheit' : 'Celsius'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
