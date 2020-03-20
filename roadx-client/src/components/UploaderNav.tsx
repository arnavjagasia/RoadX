import React from 'react';
import { Button, Card, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';


import "../styles/uploader.css";

interface IUploaderNavProps {
    states: Array<string>;
    currentState: number;
    deviceId?: number;
    canRunAnalysis: boolean;
    handleUploadStateChange: (stateNumber: number) => void;
    runAnalysis: () => void;
}

interface IUploaderNavItemProps {
    stateName: string;
    stateNumber: number;
    isDisabled: boolean;
    isCurrent: boolean;
    handleUploadStateChange: () => void;
}

class NavItem extends React.Component<IUploaderNavItemProps, {}> {
    render() {
        if (this.props.isDisabled) {
            return (
                <Card className="uploader__nav_item uploader__nav_item--disabled"> 
                    <p>{this.props.stateName}</p>
                </Card>
            )
        } else if (this.props.isCurrent) {
            return (
                <Card 
                    className="uploader__nav_item uploader__nav_item--current"
                    onClick={this.props.handleUploadStateChange}
                >
                    <p>{this.props.stateName}</p>
                </Card>
            )
        } else {
            return (
                <Card 
                    className="uploader__nav_item"
                    onClick={this.props.handleUploadStateChange}
                >
                    <p>{this.props.stateName}</p>
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
        const formattedStates: JSX.Element[] = this.props.states.map((state, idx) => {
            if (idx === this.props.currentState) {
                isCurrentState = true;
            } else if (idx > this.props.currentState) {
                isDisabled = true;
            }
            return(
                <NavItem
                    key={idx}
                    stateName={state}
                    stateNumber={idx}
                    isCurrent={isCurrentState}
                    isDisabled={isDisabled}
                    handleUploadStateChange={() => this.props.handleUploadStateChange(idx)}
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

    renderDiscoveryButton() {
        return (
            <Button 
                className="uploader__discovery_button"
                text={"Run Discovery"}
                large={true}
                disabled={!this.props.canRunAnalysis}
                icon={IconNames.GRAPH}
                onClick={this.props.runAnalysis}
            />
        )
    }

    render() {
        return (
            <div className="uploader__nav_contents">
                {this.renderUploadMetadata()}
                {this.renderFormattedNavStates()}
                {this.renderDiscoveryButton()}
            </div>
        )
    }
}