/* eslint-disable */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Agents from "./pages/Agents";
import Playground from "./pages/Playground";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Agents />} />
          <Route path="/play/:agent" element={<Playground />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
