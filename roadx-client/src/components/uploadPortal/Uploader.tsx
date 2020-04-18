import React from 'react';
import FileUploader from './FileUploader';
import DeviceRegisterer from './DeviceRegisterer';

import '../../styles/uploader.css';
import { Button, Toaster, Position, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ICreateParams, create, IAnalyzeImageParams, analyzeImage } from '../../api/api';

// Toaster for generic alerts
const UploadToaster = Toaster.create({
    className: "upload-toaster",
    position: Position.TOP,
});

// Define Uploader States
export type UploaderState = string | undefined;

const DEVICE_SELECTOR_STATE: UploaderState = "Select Device";
const IMAGE_UPLOADER_STATE: UploaderState = "Upload Image Files";
const GPS_UPLOADER_STATE: UploaderState = "Upload GPS Files";
const DISCOVERY_STATE: UploaderState = "Defect Discovery";

// Use this for spinner wheel on analyzing pane
type UploaderMode = string;
const UPLOADING_MODE: UploaderMode = "Uploading";
// const ANALYZING_MODE: UploaderMode = "Analyzing";

interface IUploaderState {
    uploaderState: UploaderState;
    uploadTime: Date;
    userId?: number;
    deviceId?: number | undefined;
    imageFile?: File;
    gpsFile?: File;
    uploaderMode: UploaderMode;
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
        uploaderMode: UPLOADING_MODE,
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

    runAnalysis = async () => {
        // Toast that analysis has started 
        UploadToaster.show({
            message: "Queued for Automated Discovery",
            intent: Intent.NONE,
            icon: IconNames.GRAPH,
        })

        const timestamp: string = this.state.uploadTime.toString();
        const createParams: ICreateParams = {
            timestamp: timestamp,
            imageBatchUploadId: this.state.deviceId + "-images-" + timestamp.replace(/\s+/g, '-').toLowerCase(),
            imageFile: this.state.imageFile!, // Blobs allow us to pass binary data
            gpsUploadId: this.state.deviceId + "-gps-" + timestamp.replace(/\s+/g, '-').toLowerCase(),
            gpsFile: this.state.gpsFile!, // Blobs allow us to pass binary data
            deviceId: String(this.state.deviceId!),
        }

        const { imageBatchUploadId, gpsUploadId } = await create(createParams); // maybe await
        
        const analyzeImageParams: IAnalyzeImageParams = {
            imageBatchUploadId: imageBatchUploadId,
            gpsUploadId: gpsUploadId
        }

        let res = await analyzeImage(analyzeImageParams);

        // Toast result of analysis
        let success: boolean = (res['status'] === "200");

        if (success) {
            UploadToaster.show({ 
                message: "Discovery Complete", 
                intent: Intent.SUCCESS,
                icon: IconNames.TICK
            });
        } else {
            UploadToaster.show({ 
                message: "Discovery Failed. " + res['message'], 
                intent: Intent.WARNING,
                icon: IconNames.CROSS
            });
        }

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
                {/* <div className="uploader__nav">
                    <UploaderNav
                        states={uploaderStates}
                        currentState={this.state.uploaderState}
                        handleUploadStateChange={this.handleUploaderStateChange}
                        deviceId={this.state.deviceId}
                    />
                </div> */}
                <div className="uploader__window">
                    {this.renderWindowContents()}
                </div>
            </div>
        )
    }
}
