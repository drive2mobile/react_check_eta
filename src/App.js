import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import QuickSearch from "./pages/QuickSearch";
import TimerTest from "./pages/TimerTest";

function App() {
    return (
        <BrowserRouter basename="/checketa">
            <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path='/quickSearch' element={<QuickSearch/>}></Route>
                <Route exact path='/timertest' element={<TimerTest/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
