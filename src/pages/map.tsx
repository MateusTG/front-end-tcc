import {
  useLoadScript,
  GoogleMap,
  MarkerF,
} from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styles from '../styles/Home.module.css';
import { clearInterval } from 'timers';

const Home: NextPage = () => {
  const [locationData, setLocationData] = useState<any>(null);

  // No componente do frontend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9000/gps/LastLocationData');
        const res = await response.json();
        
        const locationData = res.result

        console.log(locationData)
        console.log(locationData.latitude)

        if (locationData) {
          
          console.log('Location data from server:', locationData);
  
          if (locationData && locationData.latitude !== undefined && locationData.longitude !== undefined) {
            setLat(locationData.latitude);
            setLng(locationData.longitude);
          } else {
            console.error('Latitude or longitude is undefined in the received data.');
          }
        } else {
          console.error('Error retrieving location data from server:', locationData.message);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
  
    const interval = setInterval(() => {fetchData()}, 5000)
    return () =>{
      clearInterval(interval)
    }
  }, []);
  

  

  const [lat, setLat] = useState(Number(locationData?.latitude) || -9.397392);
  const [lng, setLng] = useState(Number(locationData?.longitude) || -40.4981952);

  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.sidebar}>
        <PlacesAutocomplete
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);

              setLat(lat);
              setLng(lng);
              console.log(lat, lng )
            });
          }}
        />
      </div>
      {lat && lng && isLoaded &&(
        <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '800px', height: '800px' }}
        onLoad={(map) => console.log('Map Loaded')}
      >
        <MarkerF
          position={mapCenter}
          onLoad={() => console.log('Marker Loaded')}
        />
      </GoogleMap>
      )}
    </div>
  );
};

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'us' } },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <input
        value={value}
        className={styles.autocompleteInput}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="123 Stariway To Heaven"
      />

      {status === 'OK' && (
        <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
      )}
    </div>
  );
};

export default Home;
