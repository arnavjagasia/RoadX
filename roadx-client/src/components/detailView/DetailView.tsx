import React from 'react';
import { RoadXRecord } from '../../types/types';
import { getImage } from '../../api/api';

import '../../styles/detailview.css';
import { Callout } from '@blueprintjs/core';
import Classifier from './Classifier';

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
        const { record } = this.props;
        const imageUrl: string = await getImage(record.recordId);
        this.setState({
            imageUrl: imageUrl,
        })
    }

    renderClassifications = () => {
        const { record } = this.props;
        const override: string | undefined = record.override;
        const classifications: JSX.Element[] = [];

        if (override) {
            classifications.push(
                <p key={"Override"}>Manual Override: {record.override}</p>
            )
        }

        const classname: string = override ? "detail_view__text-strikethrough" : "";
        record.defectClassifications.forEach(defect => {
            const key: string = defect.classification + ":" + defect.threshold;
            classifications.push(<p key={key} className={classname}>{defect.classification}: {defect.threshold}</p>)
        })

        return <div> {classifications} </div>
    }

    render() {
        const { record } = this.props;
        const longitude: string = String(record.longitude).substring(0, 6);
        const latitude: string = String(record.latitude).substring(0, 5);
        return(
            <div key={record.recordId} className="detail_view__container">
                <div className="detail_view__content-left">
                    <div className={"detail_view__callout"}>
                        <Callout title={"Defect Details"}>
                            <p><strong>Location:</strong> ({latitude}ºE, {longitude}ºN)</p>
                            <p><strong>Discovery Time:</strong> {record.detectionTime}</p>
                            <p><strong>Upload Time:</strong> {record.uploadTime}</p>
                        </Callout>
                    </div>
                    <div className={"detail_view__callout"}>
                        <Callout title={"Automated Classification Details"}>
                            {this.renderClassifications()}
                        </Callout>
                    </div>
                    <div className={"detail_view__callout"}>
                        <Callout title= {"Override this Classification"}>
                            <Classifier record={this.props.record}/>
                        </Callout>
                    </div>
                    

                </div>
                <div className="detail_view__content-right">
                    <h3><strong> Image </strong></h3>
                    <a target="_blank" rel="noopener noreferrer" href={this.state.imageUrl}>Click here to open the image in a new tab</a>
                    <br/>
                    <img className="list_view_card__image" src={this.state.imageUrl} alt={"Road Defect"}/>
                </div>
            </div>
        );
    }
}