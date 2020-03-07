import React from 'react';
import UploaderNav from './UploaderNav';
import FileUploader from './FileUploader';
import DeviceRegisterer from './DeviceRegisterer';

import '../styles/uploader.css';

const uploaderStates: Array<string> = [
    "Register Device",
    "Upload Files",
    "Analyze"
]

interface IUploaderState {
    uploaderState: number;
    uploadTime: Date;
    userId?: number;
    deviceId?: number;
    file?: {[key: string]: string};
}

export default class Uploader extends React.Component<{}, IUploaderState> {
    // Initialize state when component mounts
    state = {
        uploaderState: 0,
        uploadTime: new Date(),
        deviceId: undefined,
        userId: undefined,
        file: undefined,
    };

    handleUploaderStateChange = (stateNumber: number) => {
        this.setState({
            uploaderState: stateNumber
        })
    }

    registerDeviceId = (deviceId: Number) => {
        this.setState({
            deviceId: deviceId as number
        })
    }

    render() {
        return (
            <div className="uploader__container">
                <div className="uploader__nav">
                    <UploaderNav 
                        states={uploaderStates}
                        currentState={this.state.uploaderState}
                        handleUploadStateChange={this.handleUploaderStateChange}
                    />
                </div>
                <div className="uploader__window">
                    <DeviceRegisterer 
                    registerDeviceId={this.registerDeviceId} 
                    currentDeviceId={this.state.deviceId}/>
                </div>
            </div>
        )
    }   
}