// components/LocationData.tsx
import React from 'react';

interface LocationDataProps {
  data: {
    idESP: String,
    latitude: number;
    longitude: number;
    speed: number;
    date: string;
    time: string;
  };
}

const LocationData: React.FC<LocationDataProps> = ({ data }) => {
  return (
    data.idESP,
    data.latitude,
    data.longitude,
    data.speed,
    data.date,
    data.time
  )
  /*  <div>
      <h1>Localização Recebida</h1>
      <p>Latitude: {data.latitude}</p>
      <p>Longitude: {data.longitude}</p>
      <p>Velocidade: {data.speed} km/h</p>
      <p>Data: {data.date}</p>
      <p>Hora: {data.time}</p>
    </div>
  );*/
};

export default LocationData;
