import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as IconReact from 'react-bootstrap-icons';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getLocation } from '../utilities/LocationUtility';
import { Button } from 'react-bootstrap';
import { Icon0Circle } from 'react-bootstrap-icons';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
});
L.Marker.prototype.options.icon = DefaultIcon;

let CustomIcon = new Icon({
    iconUrl: `${process.env.PUBLIC_URL}/picture/location-icon.png`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

const OSM = ({markers, setMarkers, mapLocation, setMapLocation, lang, fullscreen, setFullscreen}) => {
    const [userLocation, setUserLocation] = useState(null);
    let watchId = null;
    
    useEffect(() => {
        const options = {
            enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 5
        };

        watchId = navigator.geolocation.watchPosition(
            (currPosition) => {
                const { latitude, longitude } = currPosition.coords;
                setUserLocation([latitude, longitude]);
                console.log([latitude, longitude]);
            },
            (error) => {
                console.error('Error getting user location:', error);
            },
            options
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    function onClickMarker (index) {
        return () => {
            const updatedMarkers = markers.map((marker, i) => {
                if (i === index) {
                    setMapLocation([marker.lat, marker.long]);
                    if (marker.show == true) { return { ...marker, show: false }; }
                    else { return { ...marker, show: true }; }
                }
                else { return { ...marker, show: false }; }
            });

            setMarkers(updatedMarkers);
        };
    };

    const SetMapView = () => {
        const map = useMap();
        map.setView(mapLocation, map.getZoom()); // Set the new center and keep the current zoom level
        return null;
    };

    const mapRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const map = mapRef.current;
    
        const container = containerRef.current;
        const resizeObserver = new ResizeObserver(() => {
          if (map) {
            map.invalidateSize();
          }
        });
    
        resizeObserver.observe(container);
    
        return () => { 
          resizeObserver.unobserve(container);
        };
      }, [fullscreen]);

    //   useEffect(() => {
    //     handleChangeSize();
    //   }, [fullscreen])
    
    return (
        <div ref={containerRef} style={ fullscreen ? {height:'100%', width:'100%'} : {height:'50%', width:'100%'}}>
            <MapContainer ref={mapRef} center={mapLocation} zoom={16} style={{height:'100%', width:'100%'}}>
            
            <TileLayer
                maxZoom={19} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />
            <SetMapView />
            {userLocation ? <Marker position={userLocation} icon={CustomIcon}></Marker> : ''}

            {markers ? markers.map((item, index) => (
                <Marker key={index} position={[item.lat, item.long]} eventHandlers={{ click: onClickMarker(index) }}  >
                    {item.show ?
                        <Tooltip permanent direction="top" offset={[+0, -36]} >
                            <span>{item['name_'+lang]}</span>
                        </Tooltip> : ''
                    }
                </Marker>
            )) : ''}
            <div style={{position:'absolute', zIndex:'1000', right:'10px', bottom:'20px'}}>
                <Button variant='light' onClick={() => {setFullscreen(!fullscreen)}}>
                    <IconReact.ArrowsFullscreen/>
                </Button>
            </div>
        </MapContainer>
        </div>
       
    );
};

export default OSM;