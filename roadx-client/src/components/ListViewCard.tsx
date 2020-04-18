import React from 'react';
import { RoadXRecord } from '../types/types';
import { Card, Button, Dialog, Collapse } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import '../styles/listview.css';
import DetailView from './detailView/DetailView';

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
            isDialogOpen: !this.state.isDialogOpen,
        })
    }

    render() {
        const { record } = this.props;
        const maxClassification: string = record.override ? record.override: record.defectClassifications[0].classification;
        const longitude: string = String(record.longitude).substring(0, 6);
        const latitude: string = String(record.latitude).substring(0, 5);
        // document.querySelector("#image").src = imageUrl;

        return(
            <Card elevation={2} key={record.recordId} className="list_view_card__container">
                <div className="list_view_card__header">
                    <div className="list_view_card__text">{maxClassification} discovered at ({latitude}ºE, {longitude}ºN)</div>
                    <Button 
                        className="list_view_card__info_button" 
                        icon={IconNames.INFO_SIGN}
                        onClick={this.handleOpen} 
                    />
                </div>
                <Collapse 
                    className="list_view_card__collapse"
                    isOpen={this.state.isDialogOpen}
                >
                    <DetailView record={record}/>
                </Collapse>
            </Card>
        )
    }
}