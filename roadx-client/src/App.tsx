import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import './App.css';
//import Uploader from './components/Uploader';
import * as potholeData from "./data/pothole.json";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// const App: React.FC = () => {
//   return <div>
//     <ReactMapGL> markers here </ReactMapGL>
//   </div>
//   //return (
//   //  <div className="App">
//   //    <Uploader />
//   //  </div>
//   //);
// }
//
// export default App;

export default function App(){
  const [viewport, setViewport] = useState({
    latitude: 39.953346252441406,
    longitude: -75.1633529663086,
    width: "100vw",
    height: "100vh",
    zoom: 10
  })

  //const [selectedPothole, setSelectedPothole] = useState(null);

          //   {selectedPothole ? (
          //     <Popup
          //       latitude={selectedPothole.geometry.coordinates[0]}
          //       longitude={selectedPothole.geometry.coordinates[1]}
          //       onClose={() => {
          //         setSelectedPothole(null);
          //       }}
          //     >
          //     <div>
          //       <h2>{selectedPothole.properties.POTHOLETYPE}</h2>
          //       <p>{selectedPothole.properties.DEVICE_ID}</p>
          //     </div>
          //   </Popup>
          // ) : null}

  return(
    <div>
        <ReactMapGL
        {...viewport}

        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/adeleli/ck8c1o7vf2ku71itm5c79rn2k"
        // onViewportChange={viewport => {
        //   setViewport(viewport);
        // }}
        >
          {potholeData.features.map(pothole => (
            <Marker
              key={pothole.properties.POTHOLEID}
              latitude={pothole.geometry.coordinates[0]}
              longitude={pothole.geometry.coordinates[1]}
            >
              <button className="marker-btn">
                <img src="/gps.svg" />
              </button>
            </Marker>
          ))}
        </ReactMapGL>

      </div>
  );
}
