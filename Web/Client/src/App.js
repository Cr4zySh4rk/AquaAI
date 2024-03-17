import React from "react";
import "./index.css"
import {Routes, Route} from "react-router-dom"
import Dashboard from "./routes/Dashboard";
import Analytics from "./routes/Analytics";
import Settings from "./routes/Settings";
import WifiSettings from "./routes/WifiSettings";
import AiValues from "./routes/AiValues";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/system-settings" element={<Settings />} />
        <Route path="/wifi-settings" element={<WifiSettings />} />
        <Route path="/ai-recommendations" element={<AiValues />} />
      </Routes>
    </div>
  );
}

export default App;