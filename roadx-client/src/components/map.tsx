import React, { useState, useEffect } from "react";
import InteractiveMap, { Marker, Popup } from "react-map-gl";
import * as potholeData from "./data/pothole.json";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface IMapState {
  viewport: {
    latitude: number;
    longitude: number;
    // width: number;
    // height: number;
    zoom: number;
  }
}

export default class Map extends React.Component<{}, IMapState> {
  // const [viewport, setViewport] = useState({
  //   latitude: 39.953346252441406,
  //   longitude: -75.1633529663086,
  //   width: "100vw",
  //   height: "100vh",
  //   zoom: 10
  // })

  state: IMapState = {
    viewport: {
      latitude: 39.953346252441406,
      longitude: -75.1633529663086,
      // width: "100%",
      // height: "100%"",
      zoom: 10
    }
  }

 //const [selectedPothole, setSelectedPothole] = useState(null);

 //
 // {selectedPothole ? (
 //     <Popup
 //       latitude={selectedPothole.geometry.coordinates[0]}
 //       longitude={selectedPothole.geometry.coordinates[1]}
 //       // onClose={() => {
 //       //   setSelectedPothole(null);
 //       // }}
 //     >
 //     <div>
 //       <h2>{selectedPothole.properties.POTHOLETYPE}</h2>
 //       //<p>{selectedPothole.properties.SCORES}</p>
 //       //<p>{selectedPothole.properties.TIMESTAMP}</p>
 //     </div>
 //   </Popup>
 // )}:


  public render() {
  return (
      <InteractiveMap
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width={"100%"}
        height={1000}
        latitude={this.state.viewport.latitude}
        longitude={this.state.viewport.longitude}
        zoom={this.state.viewport.zoom}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        onViewportChange={(viewport) => {
          this.setState({viewport });
        }}
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

      </InteractiveMap>
  );}
}
