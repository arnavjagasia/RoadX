import React from 'react';
import { RoadXRecord, POTHOLE, LATERAL_CRACK, ALLIGATOR_CRACK } from '../types/types';
import ListViewCard from './ListViewCard';

interface IListViewProps {
    data: Array<RoadXRecord>
}

export const testData: Array<RoadXRecord> = [{
    latitude: -75,
    longitude: 100,
    defectClassifications: [
        {classification: POTHOLE, threshold: 1}
    ],
    detectionTime: "0012041024",
    uploadTime: "1241032",
    image: new Blob(),
    recordId: "testrecord1"
},
{
    latitude: -74.0234,
    longitude: 102,
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

export default class ListView extends React.Component<IListViewProps, {}> {
    render() {
        return(
            <div className="list_view__container">
                {testData.map((record: RoadXRecord) => {
                    return(
                        <ListViewCard
                            key={record.recordId}
                            record={record}
                        />
                    )
                })}
            </div>
        )
    }
}
