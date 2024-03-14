import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import QuickSearch from "./pages/QuickSearch";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />}></Route>
                <Route path='/quickSearch' element={<QuickSearch/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
