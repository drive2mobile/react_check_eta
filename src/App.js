import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import QuickSearch from "./pages/QuickSearch";
import OSM from "./pages/OSM";
import RouteDetails from "./pages/RouteDetails";
import { useEffect, useRef, useState } from "react";
import ToastAlert from "./ui_components/ToastAlert";
import { pleaseAllowBrowserToAccessLocation } from "./utilities/Locale";
import OSMMAP from "./pages/backup/OSM_backup";

function App() {
    const [location, setLocation] = useState([]);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            distanceFilter: 1
        };

        const successCallback = async(position) => {
            const { latitude, longitude } = position.coords;
            // await new Promise(resolve => setTimeout(resolve, 5000));
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
    }, []);

    return (
        <BrowserRouter basename="/checketa">
            <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path='/quickSearch' element={<QuickSearch locationMain={location} />}> </Route>
                <Route exact path='/osm' element={<OSMMAP/>}></Route>
                <Route exact path='/routedetails' element={<RouteDetails locationMain={location} />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
