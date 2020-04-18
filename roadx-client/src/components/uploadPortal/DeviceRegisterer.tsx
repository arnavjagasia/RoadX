import React from 'react';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Button, Toaster, Position, Intent, InputGroup } from '@blueprintjs/core';

import '../../styles/registerer.css';
import { getAllDevices, IAddDeviceParams, addDevice } from '../../api/api';
import { IconNames } from '@blueprintjs/icons';

interface IDeviceRegistererProps {
    registerDeviceId: (id: Number) => void;
    currentDeviceId?: number;
}

interface IDeviceRegisterState {
    devices: number[];
    inputDeviceNum : string;
}

const DeviceSelector = Select.ofType<Number>();

const DeviceToaster = Toaster.create({
    className: "upload-toaster",
    position: Position.TOP,
});


export const renderDevice: ItemRenderer<Number> = (deviceId, { handleClick, modifiers, query }) => {
    const text: string = `Device #${deviceId}`;
    return (
        <MenuItem
            text={text}
            key={Number(deviceId)}
            onClick={handleClick}
        />
    );
};

export default class DeviceRegisterer extends React.Component<IDeviceRegistererProps, IDeviceRegisterState> {
    state: IDeviceRegisterState = {
        devices : [],
        inputDeviceNum : ""
    }

    componentDidMount=() =>  {
        this.getDevicesFromDatabase()
    }

    getDevicesFromDatabase = async () => {
        const deviceIds: number[] = await getAllDevices();
        if (deviceIds.length === 0) {
            return
        }

        this.setState({
            devices: deviceIds
        })
    }

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
                    items={this.state.devices}
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

    onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      this.setState({
          inputDeviceNum : e.target.value
      })
      console.log("Input Received")
    }

    uploadNewDevice = async () => {
        // Add new device to the database
        const { inputDeviceNum, devices } = this.state;
        const params: IAddDeviceParams = {
            inputDeviceNum: inputDeviceNum,
            devices: devices
        }

        if (devices.includes(Number(inputDeviceNum))) {
            // Don't send API request for device that is already registered
            DeviceToaster.show({
                message: "Device #" + inputDeviceNum + " is already registered",
                intent: Intent.WARNING,
                icon: IconNames.UPLOAD,
            }) 
        } else {
            // Add new device to database
            const success: boolean = await addDevice(params);
            if (!success) {
                DeviceToaster.show({
                    message: "Failed to add new device",
                    intent: Intent.DANGER,
                    icon: IconNames.UPLOAD,
                })
            }
        }
        
        // Refresh the list of devices for the device selector
        await this.getDevicesFromDatabase();
    }

    renderAddDevice() {
        const landingText: string = "Register a New Device:"

        return (
            <div className="registerer__adder">
                {landingText}
                <div className="registerer__adder">
                <InputGroup 
                    onChange={this.onChange} 
                    rightElement={
                        <Button onClick={this.uploadNewDevice} icon={IconNames.UPLOAD} minimal={true}/>    
                    }
                />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="registerer__container">
                {this.renderText()}
                { this.renderDeviceSelector() }
                {this.renderAddDevice()}
            </div>
        )
    }
}
