import React from 'react';
import { RoadXRecord } from '../types/types';
import { Card, Button, Dialog } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import '../styles/listview.css';
import { ELEVATION_2 } from '@blueprintjs/core/lib/esm/common/classes';

interface IListViewCardProps {
    record: RoadXRecord;
}

interface IListViewCardState {
    isDialogOpen: boolean;
}

export default class ListViewCard extends React.Component<IListViewCardProps, IListViewCardState> {
    state: IListViewCardState = {
        isDialogOpen: false,
    }

    handleOpen = () => {
        this.setState({
            isDialogOpen: true,
        })
    }

    handleClose = () => {
        this.setState({
            isDialogOpen: false,
        })
    }

    render() {
        const { record } = this.props;
        const maxClassification: string = record.defectClassifications[0].classification;
        const latitude: string = String(record.latitude);
        const longitude: string = String(record.longitude);

        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(record.image);
        // document.querySelector("#image").src = imageUrl;

        return(
            <Card elevation={2} key={record.recordId} className="list_view_card__container">
                <div className="list_view_card__text">{maxClassification} discovered at ({latitude}ºE, {longitude}ºN)</div>
                <Button 
                    className="list_view_card__info_button" 
                    icon={IconNames.INFO_SIGN}
                    onClick={this.handleOpen} 
                />
                <Dialog 
                    icon="graph" 
                    isOpen={this.state.isDialogOpen}
                    title="RoadX Automated Discovery Result" 
                    onClose={this.handleClose}
                >
                    <div className="list_view_card__dialog-text">
                        <h3><strong> Defect Details </strong></h3>
                        <p>Location: ({latitude}ºE, {longitude}ºN)</p>
                        <p>Discovery Time: {record.detectionTime}</p>
                        <p>Upload Time: {record.uploadTime}</p>

                        <h3><strong> Automated Classification Details </strong></h3>
                        {record.defectClassifications.map(defect => {
                            return(<p>{defect.classification}: {defect.threshold * 100 }%</p>)
                        })}
                        
                        <h3><strong> Image </strong></h3>
                        <img src={imageUrl} alt={"Road Defect"}/>
                    </div>
                </Dialog>
            </Card>
        )
    }
}