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
    return (
        <BrowserRouter basename="/checketa">
            <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path='/quickSearch' element={<QuickSearch/>}> </Route>
                <Route exact path='/osm' element={<OSMMAP/>}></Route>
                <Route exact path='/routedetails' element={<RouteDetails/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
