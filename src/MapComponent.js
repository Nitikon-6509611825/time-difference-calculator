import React from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const MapComponent = ({ lat, lng }) => {
  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  const defaultCenter = {
    lat: lat || 0,
    lng: lng || 0
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyB3iDywB9bTQpTipK2ADF-aFQXhfL_z11o"
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
