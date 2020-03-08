import React from 'react';
import UploaderNav from './UploaderNav';
import FileUploader from './FileUploader';
import DeviceRegisterer from './DeviceRegisterer';

import '../styles/uploader.css';
import { Toaster, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

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
    isRunningAnalysis: boolean;
}

const toaster = Toaster.create()

export default class Uploader extends React.Component<{}, IUploaderState> {
    // Initialize state when component mounts
    state = {
        uploaderState: 0,
        uploadTime: new Date(),
        deviceId: undefined,
        userId: undefined,
        file: undefined,
        isRunningAnalysis: false,
    };

    handleUploaderStateChange = (stateNumber: number) => {
        this.setState({
            uploaderState: stateNumber
        })
    }

    registerDeviceId = (deviceId: Number) => {
        this.setState({
            deviceId: deviceId as number,
            uploaderState: 1, // Can move from device registration to uploading files
        })
    }

    registerFile = (file: {[key: string]: string}) => {
        this.setState({
            file: file
        })
    }

    uploadFile = async () => {
        if (!this.state.file) {
            console.log("TOAST")
            const toastProps = {
                'message': 'Please select a file!',
                'intent': Intent.WARNING,
            }
            toaster.show(toastProps)
            return
        }
        const path: string = this.state.file!['path'];
        const requestData = {
            'imageFilePath': path,
            "deviceId": 123,
            "timestamp": 123,
        }

        await fetch('http://localhost:5000/create', {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }).then(response => {
            console.log(response)
        }).catch((reason) =>
            console.log(reason)
        )

        this.setState({
            isRunningAnalysis: true,
            uploaderState: 2, // Switch to analysis window
        }, () => console.log("analysis"))
    }
    renderWindowContents() {
        if (!this.state.deviceId) {
            return (
                <DeviceRegisterer 
                    registerDeviceId={this.registerDeviceId} 
                    currentDeviceId={this.state.deviceId}
                />
            )
        } else if (!this.state.isRunningAnalysis) {
            return (
                <FileUploader 
                    registerFile={this.registerFile}
                    registeredFile={this.state.file}
                    uploadFile={this.uploadFile}
                />
            )
        } else {
            return (
               <div>Analyzing</div>  
            )
        }
    }

    render() {
        return (
            <div className="uploader__container">
                <div className="uploader__nav">
                    <UploaderNav 
                        states={uploaderStates}
                        currentState={this.state.uploaderState}
                        handleUploadStateChange={this.handleUploaderStateChange}
                        deviceId={this.state.deviceId}
                    />
                </div>
                <div className="uploader__window">
                    {this.renderWindowContents()}
                </div>
            </div>
        )
    }   
}