import React from "react";
import InteractiveMap, { Marker, Popup } from "react-map-gl";
import { NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import '../styles/map.css';
import { RoadXRecord, POTHOLE, LATERAL_CRACK, ALLIGATOR_CRACK } from '../types/types';
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface IMapProps {
  data: Array<RoadXRecord>
}

interface IMapState {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  },
  popupInfo: any
}

export const testData: Array<RoadXRecord> = [{
    latitude: 39.9542353,
    longitude: -75.2017891,
    defectClassifications: [
        {classification: POTHOLE, threshold: 1}
    ],
    detectionTime: "0012041024",
    uploadTime: "1241032",
    image: new Blob(),
    recordId: "testrecord1"
},
{
    latitude:39.96,
    longitude: -75.19,
    defectClassifications: [
        {classification: LATERAL_CRACK, threshold: 0.45},
        {classification: ALLIGATOR_CRACK, threshold: 0.36}
    ],
    detectionTime: "0012041024",
    uploadTime: "1241032",
    image: new Blob(),
    recordId: "testrecord2"
},
{
    latitude: -74.12,
    longitude: 101,
    defectClassifications: [
        {classification: POTHOLE, threshold: 0.45},
        {classification: POTHOLE, threshold: 0.36}
    ],
    detectionTime: "testTIme",
    uploadTime: "testTime",
    image: new Blob(),
    recordId: "testrecord3"
}
]

export default class Map extends React.Component<IMapProps, IMapState> {
  state: IMapState = {
    viewport: {
      latitude: 39.953346252441406,
      longitude: -75.1633529663086,
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

  render() {
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
          <div className= "map__full-screen-control">
            <FullscreenControl />
          </div>
          <div className= "map__nav">
            <NavigationControl />
          </div>
          <div className= "map__scale-control">
            <ScaleControl />
          </div>

          {testData.map(record => (
              <Marker
                key={record.recordId}
                latitude={record.latitude}
                longitude={record.longitude}
              >
                <button className="marker-btn">
                  <img src="/gps.svg" />
                </button>
              </Marker>
            ))}

        </InteractiveMap>
    );
  }
}
