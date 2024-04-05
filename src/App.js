import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import QuickSearch from "./pages/QuickSearch";
import OSM from "./ui_components/OSM";
import RouteDetails from "./pages/RouteDetails";
import { useEffect, useRef, useState } from "react";
import ToastAlert from "./ui_components/ToastAlert";
import { pleaseAllowBrowserToAccessLocation } from "./utilities/Locale";
import OSMMAP from "./pages/backup/OSM_backup";
import HomePage from "./pages/HomePage";
import Storage from "./pages/testing/Storage";
import DownloadData from "./pages/DownloadData";
import GeneralSearch from "./pages/GeneralSearch";

function App() {
    const [startGettingLocation, setStartGettingLocation] = useState(false);
    const [location, setLocation] = useState([]);

    useEffect(() => {
        if (startGettingLocation)
        {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
                distanceFilter: 1
            };
    
            const successCallback = async(position) => {
                const { latitude, longitude } = position.coords;
                // await new Promise(resolve => setTimeout(resolve, 1000));
                setLocation([latitude, longitude]);
                console.log([latitude, longitude]);
            };
    
            const errorCallback = (error) => {
                console.error('Error retrieving location:', error);
                console.log([]);
            };
    
            const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    
            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [startGettingLocation]);

    return (
        <BrowserRouter basename="/checketatest">
            <Routes>
                <Route exact path="/" element={<HomePage />}></Route>
                <Route exact path='/quickSearch' element={<QuickSearch locationMain={location} setStartGettingLocation={setStartGettingLocation}/>}> </Route>
                <Route exact path='/generalsearch' element={<GeneralSearch locationMain={location} setStartGettingLocation={setStartGettingLocation}/>}></Route>
                <Route exact path='/routedetails' element={<RouteDetails locationMain={location} setStartGettingLocation={setStartGettingLocation}/>}></Route>
                <Route exact path='/downloadData' element={<DownloadData/>}></Route>
                <Route exact path='/storage' element={<Storage/>}></Route>
                <Route exact path='/osm' element={<OSMMAP/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
