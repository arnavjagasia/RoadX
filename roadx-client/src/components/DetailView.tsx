import React from 'react';
import { RoadXRecord } from '../types/types';

interface IDetailViewProps {
    record: RoadXRecord;
}

export default class DetailView extends React.Component<IDetailViewProps, {}> {
    render() {
        const { record } = this.props;
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(record.image);

        return(
            <div className="list_view_card__dialog-text">
                <h3><strong> Defect Details </strong></h3>
                <p>Location: ({record.latitude}ºE, {record.longitude}ºN)</p>
                <p>Discovery Time: {record.detectionTime}</p>
                <p>Upload Time: {record.uploadTime}</p>

                <h3><strong> Automated Classification Details </strong></h3>
                {record.defectClassifications.map(defect => {
                    return(<p key={defect.classification}>{defect.classification}: {defect.threshold * 100 }%</p>)
                })}
                
                <h3><strong> Image </strong></h3>
                <img src={imageUrl} alt={"Road Defect"}/>
            </div>
        );
    }
}