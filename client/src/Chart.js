import React from 'react';
import { Chart } from 'react-google-charts';

export const options = {
  title: 'Forecast Chart',
  curveType: 'function',
  legend: { position: 'bottom' },
};

export function ForecastChart({ dataProp }) {
  return (
    <Chart
      chartType="LineChart"
      width="900px"
      height="400px"
      style={{ margin: '0 auto' }}
      data={dataProp}
      options={options}
    />
  );
}
