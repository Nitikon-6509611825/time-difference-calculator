import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './App.css';
import MapComponent from './MapComponent';
import Geocode from 'react-geocode'; 

function App() {
  const [CCTVDate, setCCTVDate] = useState('');
  const [CCTVTime, setCCTVTime] = useState('');
  const [realDate, setRealDate] = useState('');
  const [realTime, setRealTime] = useState('');
  const [newDateInput, setNewDateInput] = useState('');
  const [newTimeInput, setNewTimeInput] = useState('');
  const [difference, setDifference] = useState('');
  const [adjustedTime, setAdjustedTime] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');

  const calculateDifference = () => {
    const cctv = moment(`${CCTVDate}T${CCTVTime}`);
    const real = moment(`${realDate}T${realTime}`);
    const diff = cctv.diff(real);
    const duration = moment.duration(Math.abs(diff));
    const isCCTVFaster = diff > 0;

    const formattedDifference = `${Math.floor(duration.asMonths())} months, ${Math.floor(
      duration.asDays() % 30
    )} days, ${Math.floor(duration.asHours() % 24)} hours, ${duration.minutes()} minutes, ${duration.seconds()} seconds`;
    setDifference(`${isCCTVFaster ? 'faster than' : 'slower than'} ${formattedDifference}`);
  };

  const adjustNewTime = () => {
    const real = moment(`${realDate}T${realTime}`);
    const cctv = moment(`${CCTVDate}T${CCTVTime}`);
    const diff = cctv.diff(real);
    const duration = moment.duration(diff);
    const newTime = moment(`${newDateInput}T${newTimeInput}`).add(duration);
    const formattedAdjustedTime = newTime.format('YYYY-MM-DD HH:mm:ss');
    setAdjustedTime(formattedAdjustedTime);
  };

  const setCurrentTime = () => {
    const now = moment();
    setRealDate(now.format('YYYY-MM-DD'));
    setRealTime(now.format('HH:mm:ss'));
  };

  useEffect(() => {
    const successHandler = (position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      // Use Geocode to fetch formatted address from latlng
      Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
        (response) => {
          const address = response.results[0].formatted_address;
          setFormattedAddress(address);
        },
        (error) => {
          console.error(error);
        }
      );
    };

    const errorHandler = (error) => {
      setError(error.message);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  return (
    
    <div className="App"> 
      <h1>Time Difference Calculator</h1>
      
      {currentPosition && (
        <div>
          <h2>Your Current Location:</h2>
          <p>Latitude: {currentPosition.lat}</p>
          <p>Longitude: {currentPosition.lng}</p>
          <p>Formatted Address: {formattedAddress}</p>
          <MapComponent lat={currentPosition.lat} lng={currentPosition.lng} />
        </div>
      )}

      {error && <p>Error: {error}</p>}

      <div>
        <label>CCTV Date:</label>
        <input type="date" value={CCTVDate} onChange={(e) => setCCTVDate(e.target.value)} />
        <label>CCTV Time:</label>
        <input type="time" step="1" value={CCTVTime} onChange={(e) => setCCTVTime(e.target.value)} />
      </div>


      <div>
        <label>Real Date: </label>
        <input type="date" value={realDate} onChange={(e) => setRealDate(e.target.value)} />
        <label>Real Time: </label>
        <input type="time" step="1" value={realTime} onChange={(e) => setRealTime(e.target.value)} />
        <button onClick={setCurrentTime}>Set Current Time</button>
      </div>
      <button onClick={calculateDifference}>Calculate Difference</button>
      {difference && <div><h2>Time Difference: {difference}</h2></div>}

      <div>
        <label>Incident Date in Real: </label>
        <input type="date" value={newDateInput} onChange={(e) => setNewDateInput(e.target.value)} />
        <label>Incident Time in Real: </label>
        <input type="time" step="1" value={newTimeInput} onChange={(e) => setNewTimeInput(e.target.value)} />
      </div>
      <button onClick={adjustNewTime}>Calculate Time of incident in CCTV</button>
      {adjustedTime && <div><h2>Time of incident in CCTV: {adjustedTime}</h2></div>}
    </div>
  );
}

export default App;
