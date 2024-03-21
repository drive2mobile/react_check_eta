import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap,  } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getLocation } from '../utilities/LocationUtility';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24,36],
    iconAnchor: [12,36]
});
L.Marker.prototype.options.icon = DefaultIcon;

let CustomIcon = new Icon({
    iconUrl: '/picture/location-icon.png',
    iconSize: [36,36],
    iconAnchor: [18,18]
  });

const OSM = () => {
    const [currLocation, setCurrLocation] = useState([22.324681505, 114.176558367]);
    const [position, setPosition] = useState([22.324681505, 114.176558367]) ;
    const [markers, setMarkers] = useState(
        [{ lat: 22.324681505, long: 114.176558367, stop: 'ABC', show: false },
        { lat: 22.310990127607496, long: 114.16906865641283, stop: 'DEF', show: false }]
    );

    const onClickMarker = (index) => {
        return () => {
            const updatedMarkers = markers.map((marker, i) => {
                if (i === index) {
                    setPosition([marker.lat, marker.long]);
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
        map.setView(position, map.getZoom()); // Set the new center and keep the current zoom level
        return null;
      };

    useEffect(async () => {
        var curr = await getLocation();
        setCurrLocation(curr);
    },[])

    return (
        <div>
            <h1>Map</h1>
            <MapContainer center={position} zoom={13} style={{ height: '400px' }} >
                <TileLayer
                    maxZoom={19}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
                    
                />
                <SetMapView />

                {markers.map((item, index) => (
                    <Marker key={index} position={[item.lat, item.long]} eventHandlers={{ click: onClickMarker(index) }}  >
                        {item.show ?
                            <Tooltip permanent direction="top" offset={[+0, -36]} >
                                <span>{item.stop}</span>
                            </Tooltip> : ''
                        }
                    </Marker>
                ))}

                    <Marker position={currLocation} icon={CustomIcon}  >
        
                    </Marker>

            </MapContainer>
        </div>

    );
};

export default OSM;