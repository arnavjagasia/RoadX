import React from 'react';
import UploaderNav from './UploaderNav';
import FileUploader from './FileUploader';
import DeviceRegisterer from './DeviceRegisterer';
import Analyzer from './Analyzer';

import '../styles/uploader.css';
import { Toaster, Intent } from '@blueprintjs/core';

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
    file?: File;
    filename?: string;
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
        filename: undefined,
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

    registerFile = (file: File) => {
        this.setState({
            file: file
        })
    }

    uploadFile = async () => {
        if (!this.state.deviceId) {
            const toastProps = {
                'message': 'Please select a device!',
                'intent': Intent.WARNING,
            }
            toaster.show(toastProps)
            return
        }
        if (!this.state.file) {
            const toastProps = {
                'message': 'Please select a file!',
                'intent': Intent.WARNING,
            }
            toaster.show(toastProps)
            return
        }
        
        const timestamp: string = this.state.uploadTime.toString();
        const filename: string = this.state.deviceId + "-" + timestamp.replace(/\s+/g, '-').toLowerCase();
        const fileBlob: Blob = this.state.file!; // Blobs allow us to pass binary data

        const formData: FormData = new FormData();
        formData.append('deviceId', this.state.deviceId!)
        formData.append('timestamp', timestamp)
        formData.append('filename', filename)
        formData.append('file', fileBlob)

        await fetch('http://localhost:5000/create', {
            method: 'POST',
            mode: 'no-cors', // cannot pass headers with no-cors
            body: formData,
        }).then(response => {
            console.log(response)
        }).catch((reason) =>
            console.log(reason)
        )

        this.setState({
            uploaderState: 2, // Switch to analysis window
            filename: filename,
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
        } else if (!this.state.filename) {
            return (
                <FileUploader 
                    registerFile={this.registerFile}
                    registeredFile={this.state.file}
                    uploadFile={this.uploadFile}
                />
            )
        } else if (this.state.filename) {
            return (
               <Analyzer 
                    filename={this.state.filename!}
               />
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