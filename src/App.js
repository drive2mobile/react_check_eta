import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import QuickSearch from "./pages/QuickSearch";
import TimerTest from "./pages/TimerTest";
import SwipeTest from "./pages/SwipeTest";
import SwipeToDismiss from "./pages/SwipeTest";

function App() {
    return (
        <BrowserRouter basename="/checketa">
            <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path='/quickSearch' element={<QuickSearch/>}></Route>
                <Route exact path='/timertest' element={<TimerTest/>}></Route>
                <Route exact path='/swipetest' element={<SwipeToDismiss/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
