import React, { useState, useEffect } from "react";
import InteractiveMap, { Marker, Popup } from "react-map-gl";
import MapGL, {NavigationControl, FullscreenControl, ScaleControl} from 'react-map-gl';
import ControlPanel from './Control-Panel';
import '../styles/map.css';
import * as potholeData from "./data/pothole.json";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface MapState {
  viewport: {
    latitude: number;
    longitude: number;
    // width: number;
    // height: number;
    zoom: number;
  },
  popupInfo: any
}

export default class App extends React.Component<{}, MapState> {
  // const [viewport, setViewport] = useState({
  //   latitude: 39.953346252441406,
  //   longitude: -75.1633529663086,
  //   width: "100vw",
  //   height: "100vh",
  //   zoom: 10
  // })

  state : MapState = {
    viewport: {
      latitude: 39.953346252441406,
      longitude: -75.1633529663086,
      // width: "100%",
      // height: "100%"",
      zoom: 10
    },
    popupInfo: null
  }

 _renderPopup() {
    const {popupInfo} = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({popupInfo: null})}
        >
        </Popup>
      )
    );
  }

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

      {this._renderPopup()}

      <div className= "map__full-screen-control">
        <FullscreenControl />
      </div>
      <div className= "map__nav">
        <NavigationControl />
      </div>
      <div className= "map__scale-control">
        <ScaleControl />
      </div>

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
