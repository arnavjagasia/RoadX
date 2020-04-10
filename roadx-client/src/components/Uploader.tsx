import React from 'react';
import UploaderNav from './UploaderNav';
import FileUploader from './FileUploader';
import DeviceRegisterer from './DeviceRegisterer';

import '../styles/uploader.css';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

// Define Uploader States
export type UploaderState = string | undefined;

const DEVICE_SELECTOR_STATE: UploaderState = "Select Device";
const IMAGE_UPLOADER_STATE: UploaderState = "Upload Image Files";
const GPS_UPLOADER_STATE: UploaderState = "Upload GPS Files";
const DISCOVERY_STATE: UploaderState = "Defect Discovery";

const uploaderStates: Array<UploaderState> = [DEVICE_SELECTOR_STATE, IMAGE_UPLOADER_STATE, GPS_UPLOADER_STATE, DISCOVERY_STATE];

interface IUploaderState {
    uploaderState: UploaderState;
    uploadTime: Date;
    userId?: number;
    deviceId?: number | undefined;
    imageFile?: File;
    gpsFile?: File;
}

export default class Uploader extends React.Component<{}, IUploaderState> {
    // Initialize state when component mounts
    state: IUploaderState = {
        uploaderState: DEVICE_SELECTOR_STATE,
        uploadTime: new Date(),
        deviceId: undefined,
        userId: undefined,
        imageFile: undefined,
        gpsFile: undefined,
    };

    handleUploaderStateChange = (newState: UploaderState) => {
        this.setState({
            uploaderState: newState
        })
    }

    registerDeviceId = (deviceId: Number) => {
        this.setState({
            deviceId: deviceId as number,
            uploaderState: IMAGE_UPLOADER_STATE,
        })
    }

    registerImageFile = (imageFile: File) => {
        this.setState({
            imageFile: imageFile,
            uploaderState: GPS_UPLOADER_STATE,
        })
    }

    registerGPSFile = (gpsFile: File) => {
        this.setState({
            gpsFile: gpsFile,
            uploaderState: DISCOVERY_STATE,
        })
    }

    uploadData = async () => {
        const timestamp: string = this.state.uploadTime.toString();
        const imageBatchUploadId: string = this.state.deviceId + "-images-" + timestamp.replace(/\s+/g, '-').toLowerCase();
        const imageFile: Blob = this.state.imageFile!; // Blobs allow us to pass binary data
        const gpsUploadId: string = this.state.deviceId + "-gps-" + timestamp.replace(/\s+/g, '-').toLowerCase();
        const gpsFile: Blob = this.state.gpsFile!; // Blobs allow us to pass binary data

        const formData: FormData = new FormData();
        // To:do
        formData.append('deviceId', String(this.state.deviceId!))
        formData.append('timestamp', timestamp)
        formData.append('imageBatchUploadId', imageBatchUploadId)
        formData.append('imageFile', imageFile)
        formData.append('gpsUploadId', gpsUploadId)
        formData.append('gpsFile', gpsFile)

        await fetch('http://localhost:5000/create', {
            method: 'POST',
            mode: 'no-cors', // cannot pass headers with no-cors
            body: formData,
        }).then(response => {
            console.log(response)
        }).catch((reason) =>
            console.log(reason)
        )

        return {
            'imageBatchUploadId': imageBatchUploadId,
            'gpsUploadId': gpsUploadId
        }
    }

    runAnalysis = async () => {
        const { imageBatchUploadId, gpsUploadId } = await this.uploadData();
        const formData: FormData = new FormData();
        formData.append('imageBatchUploadId', imageBatchUploadId)
        formData.append('gpsUploadId', gpsUploadId)
        await fetch('http://localhost:5000/analyzeImage', {
            method: 'POST',
            mode: 'no-cors', // cannot pass headers with no-cors
            body: formData
        }).then(response => {
            console.log(response)
        }).catch((reason) =>
            console.log(reason)
        )
    }

    renderWindowContents() {
        const { uploaderState, deviceId } = this.state;
        if (uploaderState === DEVICE_SELECTOR_STATE) {
            return (
                <DeviceRegisterer
                    registerDeviceId={this.registerDeviceId}
                    currentDeviceId={deviceId}
                />
            )
        } else if (uploaderState === IMAGE_UPLOADER_STATE) {
            return (
                <FileUploader
                    key={1}
                    registerFile={this.registerImageFile}
                    uploadString={"Click to select a RoadX Image Zip File."}
                    permittedFileExtensions={["application/zip"]}
                />
            )
        } else if (uploaderState === GPS_UPLOADER_STATE) {
            return (
                <FileUploader
                    key={2}
                    registerFile={this.registerGPSFile}
                    uploadString={"Click to select a RoadX GPS File."}
                    permittedFileExtensions={["text/csv"]}
                />
            )
        } else if (uploaderState === DISCOVERY_STATE) {
            return (
                <Button
                    className="uploader__discovery_button"
                    text={"Run Automated Discovery"}
                    large={true}
                    disabled={!this.state.imageFile || !this.state.gpsFile}
                    icon={IconNames.GRAPH}
                    onClick={this.runAnalysis}
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
