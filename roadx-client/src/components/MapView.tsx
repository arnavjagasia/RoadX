import React from "react";
import InteractiveMap, { Marker, Popup } from "react-map-gl";
import { NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';

import { RoadXRecord, POTHOLE, LATERAL_CRACK, ALLIGATOR_CRACK, LONGITUDINAL_CRACK } from '../types/types';
import DetailView from "./DetailView";

import '../styles/map.css';

// const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const MAPBOX_TOKEN ="pk.eyJ1IjoiYWRlbGVsaSIsImEiOiJjazhjMHdvMDUwZWttM2Z0N3lhbDc5cXdzIn0.44vjuMJE2Icp-hV1P1d3TQ";


interface IMapProps {
	data: Array<RoadXRecord>
}

interface IMapState {
	viewport: {
		latitude: number;
		longitude: number;
		zoom: number;
	},
	currentPopUpRecord: RoadXRecord | undefined,
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
		latitude: 39.97,
		longitude: -75.18,
		defectClassifications: [
				{classification: POTHOLE, threshold: 0.45},
				{classification: LONGITUDINAL_CRACK, threshold: 0.36}
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
		currentPopUpRecord: null
    }
    
    setPopUp = (record: RoadXRecord) => {
        this.setState({currentPopUpRecord: record})
    }

    closePopUp = () => {
        this.setState({currentPopUpRecord: undefined});
    }

    showPopUp() {
        const { currentPopUpRecord } = this.state;
        // Make sure the current record is not undefined 
		return (
			currentPopUpRecord && (
				<Popup
					tipSize={5}
					anchor="top"
					longitude={currentPopUpRecord.longitude}
					latitude={currentPopUpRecord.latitude}
					closeOnClick={false}
                    onClose={this.closePopUp}
                    key={currentPopUpRecord.recordId}
				>
                    <DetailView key={currentPopUpRecord.recordId} record={currentPopUpRecord} />
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
                
                {this.showPopUp()}

				{testData.map(record => (
                    <Marker
                        key={record.recordId}
                        latitude={record.latitude}
                        longitude={record.longitude}
                    >
                        <button className="marker-btn" onClick={() => this.setPopUp(record)}>
                            <img src='/gps.svg' alt={'GPS Icon'}/>
                        </button>
                    </Marker>
                ))}

			</InteractiveMap>
		);
	}
}
