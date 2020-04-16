import React from 'react';
import { RoadXRecord } from '../types/types';
import { Card, Button, Dialog } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import '../styles/listview.css';
import DetailView from './DetailView';

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
                    <DetailView record={record} />
                </Dialog>
            </Card>
        )
    }
}