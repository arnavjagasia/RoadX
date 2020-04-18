import React from 'react';
import { RoadXRecord } from '../types/types';
import { getImage } from '../api/api';

interface IDetailViewProps {
    record: RoadXRecord;
}

interface IDetailViewState {
    imageUrl: string | undefined;
}

export default class DetailView extends React.Component<IDetailViewProps, {}> {
    state: IDetailViewState = {
        imageUrl: undefined
    }

    componentDidMount = async () => {
        console.log("YOO")
        const { record } = this.props;
        const imageUrl: string = await getImage(record.recordId);
        this.setState({
            imageUrl: imageUrl,
        })
    }
    render() {
        const { record } = this.props;
        return(
            <div key={record.recordId} className="list_view_card__dialog-text">
                <h3><strong> Defect Details </strong></h3>
                <p>Location: ({record.latitude}ºE, {record.longitude}ºN)</p>
                <p>Discovery Time: {record.detectionTime}</p>
                <p>Upload Time: {record.uploadTime}</p>

                <h3><strong> Automated Classification Details </strong></h3>
                {record.defectClassifications.map(defect => {
                    const key: string = defect.classification + ":" + defect.threshold;
                    return(<p key={key}>{defect.classification}: {defect.threshold}%</p>)
                })}
                
                <h3><strong> Image </strong></h3>
                <img className="list_view_card__image" src={this.state.imageUrl} alt={"Road Defect"}/>
            </div>
        );
    }
}