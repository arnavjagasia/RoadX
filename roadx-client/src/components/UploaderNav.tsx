import React from 'react';
import { Card, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';


import "../styles/uploader.css";
import { UploaderState } from './Uploader';

interface IUploaderNavProps {
    states: Array<UploaderState>;
    currentState: UploaderState;
    deviceId?: number;
    handleUploadStateChange: (uploaderState: UploaderState) => void;
}

interface IUploaderNavItemProps {
    uploaderState: UploaderState;
    isDisabled: boolean;
    isCurrent: boolean;
    handleUploadStateChange: () => void;
}

class NavItem extends React.Component<IUploaderNavItemProps, {}> {
    render() {
        if (this.props.isDisabled) {
            return (
                <Card className="uploader__nav_item uploader__nav_item--disabled"> 
                    <p>{this.props.uploaderState}</p>
                </Card>
            )
        } else if (this.props.isCurrent) {
            return (
                <Card 
                    className="uploader__nav_item uploader__nav_item--current"
                    onClick={this.props.handleUploadStateChange}
                >
                    <p>{this.props.uploaderState}</p>
                </Card>
            )
        } else {
            return (
                <Card 
                    className="uploader__nav_item"
                    onClick={this.props.handleUploadStateChange}
                >
                    <p>{this.props.uploaderState}</p>
                    <Icon icon={IconNames.TICK} />
                </Card>
            )
        }
    }
}

export default class UploaderNav extends React.Component<IUploaderNavProps, {}> {
    renderFormattedNavStates() {
        let isDisabled: boolean = false
        let isCurrentState: boolean = false
        const formattedStates: JSX.Element[] = this.props.states.map((uploaderState, idx) => {
            if (uploaderState === this.props.currentState) {
                isDisabled = true;
                isCurrentState = true;
            } else {
                isCurrentState = false;
            }
            return(
                <NavItem
                    key={idx}
                    uploaderState={uploaderState}
                    isCurrent={isCurrentState}
                    isDisabled={isDisabled && !isCurrentState}
                    handleUploadStateChange={() => this.props.handleUploadStateChange(uploaderState)}
                />
            )
        })
        return formattedStates
    }

    renderUploadMetadata() {
        return (
            <div className="uploader__nav_metadata_section">
                <div className="uploader__nav_title"> RoadX Data Upload Portal </div>
                {
                    this.props.deviceId && 
                    <div className="uploader__nav_metadata_item"> 
                        Device Id: {this.props.deviceId} 
                    </div>
                }
            </div>
        )
    }

    render() {
        return (
            <div className="uploader__nav_contents">
                {this.renderUploadMetadata()}
                {this.renderFormattedNavStates()}
            </div>
        )
    }
}