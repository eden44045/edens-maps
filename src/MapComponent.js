import React, { useEffect, useRef, useState } from 'react';
import '@arcgis/core/assets/esri/themes/light/main.css';
import { loadModules } from 'esri-loader';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let view;

    loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/symbols/SimpleMarkerSymbol'])
      .then(([Map, MapView, FeatureLayer, SimpleMarkerSymbol]) => {
        const map = new Map({
          basemap: 'streets'
        });

        view = new MapView({
          container: mapRef.current,
          map: map,
          center: [34.8516, 31.0461], // ישראל
          zoom: 7
        });

        // יצירת שכבת נקודות עם ערי הבירה בלבד
        const featureLayer = new FeatureLayer({
          url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Cities/FeatureServer/0',
          outFields: ['CITY_NAME', 'POP', 'STATUS'],
          popupEnabled: false,
          definitionExpression: "STATUS = 'National and provincial capital'",
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-marker",
              color: [255, 0, 0], // אדום
              size: 8,
              outline: {
                color: [0, 0, 0],
                width: 1
              }
            }
          }
        });

        map.add(featureLayer);

        // מאזין לאירוע קליק במפה
        view.on("click", async (event) => {
          const response = await view.hitTest(event);
          const result = response.results.find(res => res.graphic && res.graphic.layer === featureLayer);

          if (result) {
            const attributes = result.graphic.attributes;
            console.log(" רשימת השדות בשכבה:", featureLayer.fields.map(f => f.name));
            console.log(" נתוני העיר שנבחרה:", attributes); // הדפס את כל הנתונים
            setPopupData({
              city: attributes.CITY_NAME,
              population: attributes.POP
            });

            setPopupPosition({ x: event.x, y: event.y });
          } else {
            setPopupData(null);
          }
        });
      })
      .catch((err) => console.error(err));

    return () => view?.destroy();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

      {/* פופ-אפ מותאם אישית */}
      {popupData && (
        <div
          style={{
            position: 'absolute',
            left: popupPosition.x + 10,
            top: popupPosition.y + 10,
            background: '#ffffff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
            🌍 {popupData.city}
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
            👥 Population: <strong>{popupData.population.toLocaleString()}</strong>
          </p>
          <button onClick={() => setPopupData(null)} style={{
            background: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;