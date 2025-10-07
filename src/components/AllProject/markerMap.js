import React, { useState, useEffect } from 'react';
import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';
import {
  InfoWindow,
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import $ from 'jquery';
import { MdMyLocation } from 'react-icons/md';

const {
  StandaloneSearchBox,
} = require('react-google-maps/lib/components/places/StandaloneSearchBox');
const Map = compose(
  // lifecycle({
  //   componentWillMount() {
  //     const refs = {};

  //     this.setState({
  //       places: [],
  //       onSearchBoxMounted: ref => {
  //         refs.searchBox = ref;
  //       },
  //       onPlacesChanged: () => {
  //         const places = refs.searchBox.getPlaces();

  //         this.setState({
  //           isMarkerShown:false,
  //           places,
  //         });
  //       },
  //     });
  //   },
  // }),
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
  const [inputer, setInputer] = useState(false);
  const [checker, setChecker] = useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [isMarkerShown, setisMarkerShown] = React.useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(location =>
      setMarker({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      }),
    );
  }, []);
  const refs = {};
  const onSearchBoxMounted = ref => {
    refs.searchBox = ref;
  };
  const onPlacesChanged = () => {
    const places = refs.searchBox.getPlaces();
    if (places) {
      places.map(
        ({ place_id, formatted_address, geometry: { location } }) => {
          const name = formatted_address;
          setName({
            name,
          });
          setMarker({ lat: location.lat(), lng: location.lng() });
          // c.lat = location.lat();
          // c.lng = location.lng();
        },
      );
    }
    setChecker(false);
    setisMarkerShown(false);
    setInputer(true);
    
  };
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        position => {
          setDisabled(false);
          setisMarkerShown(false);
          setChecker(true);
          setInputer(false);
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable

          setMarker({ lat: latitude, lng: longitude });
          setIsOpen(true);
        },
        // if there was an error getting the users location
        error => {
          console.error('Error getting user location:', error);
        },
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  const onMapClick1 = (e: google.maps.MapMouseEvent) => {
    if (e.placeId) {
      $.get(
        'https://places.googleapis.com/v1/places/' +
          e.placeId +
          '?fields=id,displayName&key=AIzaSyAm351eCklNPQVspYOWV9R7D2m4q_oViTg',
        function (data, status) {
          const name = data['displayName'].text;
          setName({
            name,
          });
        },
      );
    }
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setisMarkerShown(true);
    setIsOpen(true);
    setChecker(false);
    setInputer(false);
  };
  // let c = {};
  // if (props.datamap) {
  //   const name = props.datamap;
  //   setName({
  //     name,
  //   });
  // }
  // $('#location').val()
  

  let center = {
    // lat: inputer?c.lat : checker? marker.lat : isMarkerShown? marker.lat : props.lat? +props.lat : marker? marker.lat : 13.861721108172372,
    // lng: inputer?c.lng : checker? marker.lng : isMarkerShown? marker.lng : props.lng? +props.lng : marker? marker.lng : 100.51356196403503,
    lat:
      inputer || checker || isMarkerShown
        ? marker.lat
        : props.lat
        ? +props.lat
        : marker
        ? marker.lat
        : 13.861721108172372,
    lng:
      inputer || checker || isMarkerShown
        ? marker.lng
        : props.lng
        ? +props.lng
        : marker
        ? marker.lng
        : 100.51356196403503,
  };

  // $('#lat').val('');
  // $('#lng').val('');
  // const a = inputer?c.lat:checker?marker.lat:isMarkerShown?marker.lat:props.lat?props.lat:marker?marker.lat:13.861721108172372;
  // const b = inputer?c.lng:checker?marker.lng:isMarkerShown?marker.lng:props.lng?props.lng:marker?marker.lng:100.51356196403503;
  const a =
    inputer || checker || isMarkerShown
      ? marker.lat
      : props.lat
      ? props.lat
      : marker
      ? marker.lat
      : 13.861721108172372;
  const b =
    inputer || checker || isMarkerShown
      ? marker.lng
      : props.lng
      ? props.lng
      : marker
      ? marker.lng
      : 100.51356196403503;
  // let [state, setState] = useState(null);
  // setState({
  //   lat:a,
  //   lng:b,
  //   lacation:dataname?dataname:props.datamap
  // })
  if (name) {
    $('#location').val(name.name);
  }
  $('#lat').val(a);
  $('#lng').val(b);
  const [isOpen, setIsOpen] = useState(true);
  const onToggleOpen = isOpen => {
    setIsOpen(!isOpen);
  };
  const onToggleClose = () => {
    setIsOpen(false);
  };
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
      <div
        data-standalone-searchbox=""
        style={{ position: 'absolute', left: '40%', top: '10px' }}
      >
        <StandaloneSearchBox
          ref={onSearchBoxMounted}
          bounds={props.bounds}
          onPlacesChanged={onPlacesChanged}
          // onChange={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="ค้นหา"
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
                      <div>{name ? name['name'] : props.datamap?props.datamap:''}</div>
                      {/* <div>
                        <a
                          href={
                            'https://www.google.com/maps/@' +
                            center.lat +
                            ',' +
                            center.lng +
                            ',18z?hl=th-TH&entry=ttu'
                          }
                          target="_blank"
                        >
                          ดูใน Google Map
                        </a>
                      </div> */}
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
                      ? name['name']
                      : marker
                      ? 'คุณอยู่ที่นี้'
                      : props.lat
                      ? ''
                      : 'สำนักงานเทศบาลนครนนทบุรี'}
                  </div>
                  {/* <div>
                    <a
                      href={
                        'https://www.google.com/maps/@' +
                        center.lat +
                        ',' +
                        center.lng +
                        ',18z?hl=th-TH&entry=ttu'
                      }
                      target="_blank"
                    >
                      ดูใน Google Map
                    </a>
                  </div> */}
                </div>
              </InfoWindow>
            </Marker>
          </div>
        )}
      </GoogleMap>
    </div>
  );
});
export default function SimpleMap(data) {
  return (
    <div style={{ height: '100%', textAlign: 'center' }}>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAm351eCklNPQVspYOWV9R7D2m4q_oViTg&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        datamap={data.place}
        lat={data.lat ? data.lat : ''}
        lng={data.lng ? data.lng : ''}
      />
    </div>
  );
}
