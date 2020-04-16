import React from 'react';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';

import '../../styles/registerer.css';

interface IDeviceRegistererProps {
    registerDeviceId: (id: Number) => void;
    currentDeviceId?: number;
}

interface IDeviceRegisterState {
    devices: Number[];
    inputDeviceNum : string;
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


function handleSubmit(value : string) {
  var y = +value
  if(devices.indexOf(y) == -1 && !isNaN(y)) {
    devices.push(y)
    console.log("Number Added")
    console.log(devices)
  }
  else {
    console.log("Device Number Already Exists")
    console.log(devices)
  }
}


export default class DeviceRegisterer extends React.Component<IDeviceRegistererProps, IDeviceRegisterState> {
    state: IDeviceRegisterState = {
        devices : [],
        inputDeviceNum : ""
    }
    renderText() {
        const landingText: string = "Let's begin. Please select your RoadX device."
        return (
            <div className="registerer__text">
                {landingText}
            </div>
        )
    }

    componentDidMount=() =>  {
        this.getAllDevices()
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

   
   getAllDevices = async () => {
    await fetch('http://localhost:5000/getDevices', {
        method: 'GET',
        mode: 'no-cors', // cannot pass headers with no-cors
    }).then(response => response.json()).then(devices => {
        this.setState({
            devices : devices,
        })
    }).catch((reason) =>
        console.log(reason)
    )
}

   uploadNewDevice = async () => {
        const formData: FormData = new FormData();
        formData.append('deviceId', String(this.state.inputDeviceNum))

        await fetch('http://localhost:5000/addDevice', {
            method: 'POST',
            mode: 'no-cors', // cannot pass headers with no-cors
            body: formData,
        }).then(response => {
            console.log(response)
        }).catch((reason) =>
            console.log(reason)
        )
        await this.getAllDevices()
    }

    renderAddDevice() {
      const landingText: string = "Register a New Device:"
      const submitText: string = "Submit"
      const value: string = ""

      return (
          <div className="registerer__adder">
              {landingText}
              <div className="registerer__adder">
                <input
                  type = "text"
                  onChange = {this.onChange}
                />
                <div className="registerer__adder">
                  <button
                            onClick={this.uploadNewDevice}
                        >
                          Submit
                  </button>
                </div>
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
