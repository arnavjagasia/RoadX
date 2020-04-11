import React from 'react';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';

import '../../styles/registerer.css';

interface IDeviceRegistererProps {
    registerDeviceId: (id: Number) => void;
    currentDeviceId?: number;
}

const DeviceSelector = Select.ofType<Number>();


// Hard-coding device id's for now
const devices: number[] = [1, 2, 4, 10, 50, 67]
export const renderDevice: ItemRenderer<Number> = (deviceId, { handleClick, modifiers, query }) => {
    const text = `Device #${deviceId}`;
    return (
        <MenuItem
            text={text}
            key={Number(deviceId)}
            onClick={handleClick}
        />
    );
};

export default class DeviceRegisterer extends React.Component<IDeviceRegistererProps, {}> {
    renderText() {
        const landingText: string = "Let's begin. Please select your RoadX device."
        return (
            <div className="registerer__text">
                {landingText}
            </div>
        )
    }

    renderDeviceSelector() {
        const selectorText: string = this.props.currentDeviceId ?
        `Device #${this.props.currentDeviceId}` :
        "Select a device..."
        return (
            <div className="registerer__selector">
                <DeviceSelector
                    items={devices}
                    itemRenderer={renderDevice}
                    onItemSelect={this.props.registerDeviceId}
                >
                    <Button
                        text={selectorText}
                        rightIcon="double-caret-vertical"
                        large={true}
                    />
                </DeviceSelector>
            </div>
        )
    }

    render() {
        return (
            <div className="registerer__container">
                {this.renderText()}
                { this.renderDeviceSelector() }
            </div>
        )
    }
}
