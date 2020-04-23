import React from 'react';
import { RoadXRecord } from '../../types/types';
import { getImage } from '../../api/api';

import '../../styles/detailview.css';
import { Callout, Tooltip, Icon, PopoverInteractionKind } from '@blueprintjs/core';
import Classifier from './Classifier';
import { IconNames } from '@blueprintjs/icons';

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
            const classificationString: string = defect.classification + ": " + defect.threshold + "% Confidence";
            classifications.push(<p key={classificationString}>{classificationString}</p>)
        })

        return <div> {classifications} </div>
    }

    render() {
        const { record } = this.props;
        const longitude: string = String(record.longitude).substring(0, 6);
        const latitude: string = String(record.latitude).substring(0, 5);
        const discoveryTime: string = record.detectionTime.toLocaleString();
        return(
            <div key={record.recordId} className="detail_view__container">
                <div className="detail_view__content-left">
                    <div className={"detail_view__callout"}>
                        <Callout title={"Defect Details"}>
                            <p><strong>Location:</strong> ({latitude}ºE, {longitude}ºN)</p>
                            <p><strong>Discovery Time:</strong> {discoveryTime}</p>
                            <p><strong>Upload Time:</strong> {record.uploadTime}</p>
                        </Callout>
                    </div>
                    <div className={"detail_view__callout"}>
                        <Callout title={"Automated Classification Details"}>
                            <div className={"detail_view__callout-classifications-content"}>
                            <div className={"detail_view__callout-classifications-content--text"}>
                                {this.renderClassifications()}
                            </div>
                            <div className={"detail_view__callout-classifications-content--tooltip-container"}> 
                                <Tooltip
                                    content={<div className={"detail_view__callout-classifications-content--tooltip"}>
                                        RoadX's automated discovery classification model identifies the likelihood of a defects in an image from the RoadX device. To filter by  confidence threshold, Use the toolbar on the left.
                                    </div>} 
                                    interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
                                >
                                    <Icon icon={IconNames.INFO_SIGN}/>
                                </Tooltip>
                            </div>
                            </div>
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