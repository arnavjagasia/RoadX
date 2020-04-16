import React from "react";
import InteractiveMap, { Marker, Popup } from "react-map-gl";
import { NavigationControl, FullscreenControl } from 'react-map-gl';

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
		latitude: 39.94799,
		longitude: -75.222728,
		defectClassifications: [
				{classification: POTHOLE, threshold: 1}
		],
		detectionTime: "0012041024",
		uploadTime: "1241032",
		image: new Blob(),
		recordId: "testrecord1"
},
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

				{this.props.data.map(record => {
					console.log(record)
					return(
                    <Marker
                        key={record.recordId}
                        latitude={record.latitude}
                        longitude={record.longitude}
                    >
                        <button className="marker-btn" onClick={() => this.setPopUp(record)}>
                            <img src='/gps.svg' alt={'GPS Icon'}/>
                        </button>
                    </Marker>
				)})}

			</InteractiveMap>
		);
	}
}
