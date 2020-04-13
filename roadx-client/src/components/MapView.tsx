import React from "react";
import InteractiveMap, { Marker, Popup } from "react-map-gl";
import { NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import { forwardRef } from 'react';

import { RoadXRecord, POTHOLE, LATERAL_CRACK, ALLIGATOR_CRACK, LONGITUDINAL_CRACK } from '../types/types';
import DetailView from "./DetailView";

import '../styles/map.css';
import { Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

// const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const MAPBOX_TOKEN ="pk.eyJ1IjoiYWRlbGVsaSIsImEiOiJjazhjMHdvMDUwZWttM2Z0N3lhbDc5cXdzIn0.44vjuMJE2Icp-hV1P1d3TQ";


interface IMapProps {
	data: Array<RoadXRecord>
	updateMapScope: (minLatitude: number, minLongitude: number, maxLatitude: number, maxLongitude: number) => void;
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
	private mapRef: any;

	constructor(props: IMapProps) {
		super(props);
		this.mapRef = React.createRef();
	}

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
	
	refreshMapData = () => {
		const myMap = this.mapRef.current.getMap();
		const mapBoundaries = myMap.getBounds();
		const minLatitude = mapBoundaries.getSouthWest()['lat'];
		const minLongitude = mapBoundaries.getSouthWest()['lng'];
		const maxLatitude = mapBoundaries.getNorthEast()['lat'];
		const maxLongitude = mapBoundaries.getNorthEast()['lng'];
		this.props.updateMapScope(minLatitude, minLongitude, maxLatitude, maxLongitude);
	}

	getMapBoundaries = () => {
		// Get map boundaries
		console.log(this.mapRef);
		const myMap = this.mapRef.current.getMap();
		const mapBoundaries = myMap.getBounds();
		const northeast = mapBoundaries.getNorthEast();
		const northwest = mapBoundaries.getNorthWest();
		const southeast = mapBoundaries.getSouthEast();
		const southwest = mapBoundaries.getSouthWest();
		console.log('Northeast:', northeast);
		console.log('Northwest:', northwest);
		console.log('Southeast:', southeast);
		console.log('Southwest:', southwest);
	}

	componentDidMount = () => this.getMapBoundaries();

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
				ref={this.mapRef}
				mapStyle='mapbox://styles/mapbox/streets-v11'
				onViewportChange={(viewport) => {
					this.setState({viewport });
				}}
			>
				<FullscreenControl className="map__full-screen-control"/>
				<NavigationControl className= "map__nav"/>
				<Button 
					className="map__refresh-button"
					text={"Search this area again"} 
					icon={IconNames.REFRESH}
					onClick={this.refreshMapData}
				/>

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
