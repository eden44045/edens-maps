import React from "react";
import MapComponent from "./MapComponent";

function App() {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
        🗺️ המפה של עדן 🌍
      </h1>
      <MapComponent/>
    </div>
  );
}

export default App;
