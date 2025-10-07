import React, { useState, useEffect, useRef } from 'react';
import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';
import { Button } from 'reactstrap';
import { InfoWindow, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import $ from 'jquery';
import { MdMyLocation } from 'react-icons/md';
import { SSF } from 'xlsx';

const {
  StandaloneSearchBox,
} = require('react-google-maps/lib/components/places/StandaloneSearchBox');
const Map = compose(
  withStateHandlers(
    () => ({
      isMarkerShown: false,
      markerPosition: null,
      isOpen: true,
    }),
    {
      onMapClick:
        ({ isMarkerShown, isOpen, check }) =>
        e => ({
          markerPosition: e.latLng,
          isMarkerShown: true,
          isOpen: true,
          // check: false,
        }),
    },
  ),
  withScriptjs,
  withGoogleMap,
)(props => {
  const [marker, setMarker] = useState(null);
  const [name, setName] = useState(null);
  const [isMarkerShown, setisMarkerShown] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongtitude] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const pName = useRef('');
  const plat = useRef('');
  const plng = useRef('');
  
  const setx = (name, lat, lng) => {
    if (name !== undefined && lat !== undefined && lng !== undefined) {
      props.onClickMap({
        map_data: name,
        lat: lat,
        lng: lng,
      });
    } else {
      // console.error('Invalid parameters for setx:', { name, lat, lng });
    }
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(location => {
      setLatitude(location.coords.latitude);
      setLongtitude(location.coords.longitude);
    });
  }, []);
  useEffect(() => {
    // Update the ref with the new datamap value
    pName.current = props.datamap;
  
    // Update the state only if the datamap is different from the current name
    if (props.datamap !== name) {
      setName(props.datamap);
    }
  }, [props.datamap]);
  useEffect(() => {
    plat.current = props.lat;

    if (latitude !== plat.current) setLatitude(props.lat);
  }, [props.lat]);
  useEffect(() => {
    plng.current = props.lng;

    if (longitude !== plng.current) setLongtitude(props.lng);
  }, [props.lng]);
  const refs = {};
  const onSearchBoxMounted = ref => {
    refs.searchBox = ref;
  };
  const onPlacesChanged = () => {
    const places = refs.searchBox.getPlaces();
    if (places) {
      places.map(({ formatted_address, geometry: { location } }) => {
        const name = formatted_address;
        setName(name);
        setLatitude(location.lat());
        setLongtitude(location.lng());
        setMarker({ lat: location.lat(), lng: location.lng() });
      });
    }
    setisMarkerShown(false);
  };
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        position => {
          setisMarkerShown(false);
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setLatitude(latitude);
          setLongtitude(longitude);
          setMarker({ lat: latitude, lng: longitude });
          setIsOpen(true);
        },
        // if there was an error getting the users location
        error => {
          // console.error('Error getting user location:', error);
        },
      );
    }
    // if geolocation is not supported by the users browser
    else {
      // console.error('Geolocation is not supported by this browser.');
    }
  };
  const onMapClick1 = (e: google.maps.MapMouseEvent) => {
    if (e.placeId) {
      $.get(
        'https://places.googleapis.com/v1/places/' +
          e.placeId +
          '?fields=id,displayName&key='+process.env.REACT_APP_MAP_KEY,
        function (data, status) {
          const name = data['displayName'].text;
          setName(name);
        },
      );
    }
    setLatitude(e.latLng.lat());
    setLongtitude(e.latLng.lng());
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setisMarkerShown(true);
    setIsOpen(true);
    $('#search').val('');
  };
  let center = {
    lat: +latitude,
    lng: +longitude,
  };

  const onToggleOpen = () => {
    setIsOpen(prev => !prev);
  };
  const onToggleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const currentLat = latitude&&latitude !== undefined ? latitude : props.lat;
    const currentLng = longitude&&longitude !== undefined ? longitude : props.lng;
    setx(name ? name : props.datamap, currentLat, currentLng);
  }, [name, latitude, longitude]);
  return (
    <div>
      {/* <button
        // type="button"
        // onClick={this.getUserLocation}
        className="btn btn-default"
        disabled={disabled}
        onClick={
          (props.onSetMarkerShown,
          () => {
            setDisabled(true);
            getUserLocation();
          })
        }
        style={{ position: 'absolute', top: '46%', right: '23px' }}
      >
        <MdMyLocation />
        {disabled ? 'กำลังค้นหา ...' : 'เช็คตำแหน่งปัจจุบัน'}
      </button> */}
      <div data-standalone-searchbox="" style={{ position: 'absolute', left: '40%', top: '10px' }}>
        <StandaloneSearchBox
          ref={onSearchBoxMounted}
          bounds={props.bounds}
          onPlacesChanged={onPlacesChanged}
          // onChange={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="ค้นหา"
            id="search"
            // onChange={onPlacesChanged}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </StandaloneSearchBox>
      </div>
      <GoogleMap defaultZoom={18} defaultCenter={center} onClick={onMapClick1}>
        {isMarkerShown ? (
          <div>
            <Marker position={center} onClick={onToggleOpen}>
              {isOpen ? (
                <div>
                  <InfoWindow onCloseClick={onToggleClose}>
                    <div>
                      <div>{name ? name : 'คุณอยู่ที่นี้'}</div>
                    </div>
                  </InfoWindow>
                </div>
              ) : (
                ''
              )}
            </Marker>
          </div>
        ) : (
          <div>
            <Marker position={center} onClick={onToggleOpen}>
              <InfoWindow onCloseClick={onToggleOpen}>
                <div>
                  <div>
                    {name
                      ? name
                      : marker
                      ? 'คุณอยู่ที่นี้'
                      : 'สำนักงานเทศบาลนครนนทบุรี'}
                  </div>
                </div>
              </InfoWindow>
            </Marker>
          </div>
        )}
      </GoogleMap>
    </div>
  );
});
export default function SimpleMap({ place, lat, lng, onChangeMap }) {
  const handleMapChange = (e) => {
    const {map_data,lat,lng} = e
    if (lat && lng) {
      onChangeMap({
        map_data: map_data,
        lat: lat,
        lng: lng
      });
  };
}
  return (
    <div style={{ height: '100%', textAlign: 'center' }}>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        datamap={place}
        lat={lat}
        lng={lng}
        onClickMap={handleMapChange}
      />
    </div>
  );
}
