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
    iconUrl: `${process.env.PUBLIC_URL}/picture/location.png`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

const OSM = ({markers, setMarkers, mapLocation, setMapLocation, lang, fullscreen, setFullscreen, locationMain}) => {
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [autoCenter, setAutoCenter] = useState(false);
    
    useEffect(() => {
        if (locationMain.length > 0)
            setUserLocation(locationMain);
    }, [locationMain]);

    useEffect(() => {
        async function triggerAutoCenter(){
            setAutoCenter(true);
            await new Promise(resolve => setTimeout(resolve, 100));
            setAutoCenter(false);
        }
        triggerAutoCenter();
    },[markers]);

    useEffect(() => {
        const map = mapRef.current;

        const container = containerRef.current;
        const resizeObserver = new ResizeObserver(() => {
            if (map) { map.invalidateSize(); }
        });
        resizeObserver.observe(container);
        return () => {  resizeObserver.unobserve(container); };
    }, [fullscreen]);

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
            // setAutoCenter(false);
        };
    };

    const SetMapView = () => {
        const map = useMap();
        map.setView(mapLocation, map.getZoom()); 
        return null;
    };
    
    return (
        <div ref={containerRef} style={ fullscreen ? {height:'100%', width:'100%'} : {height:'45%', width:'100%'}}>
            <MapContainer ref={mapRef} center={mapLocation} zoom={16} style={{height:'100%', width:'100%'}}>
            
            <TileLayer
                maxZoom={19} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />
            {autoCenter ? <SetMapView /> : ''}
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