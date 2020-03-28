import React from 'react';
import UploaderNav from './UploaderNav';
import FileUploader from './FileUploader';
import DeviceRegisterer from './DeviceRegisterer';

import '../styles/uploader.css';
import { Toaster, Intent } from '@blueprintjs/core';

const uploaderStates: Array<string> = [
    "Select Device",
    "Upload Image Files",
    "Upload GPS Files"
]

interface IUploaderState {
    uploaderState: number;
    uploadTime: Date;
    userId?: number;
    deviceId?: number;
    imageFile?: File;
    imageFilename?: string;
    gpsFile?: File;
}

const toaster = Toaster.create()

export default class Uploader extends React.Component<{}, IUploaderState> {
    // Initialize state when component mounts
    state = {
        uploaderState: 0,
        uploadTime: new Date(),
        deviceId: 0,
        userId: 0,
        imageFile: new File(null, null),
        imageFilename: "",
        gpsFile: new File(null, null),
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

    registerImageFile = (imageFile: File) => {
        this.setState({
            imageFile: imageFile
        })
    }

    registerGPSFile = (gpsFile: File) => {
        this.setState({
            gpsFile: gpsFile
        })
    }

    uploadImageFile = async () => {
        if (!this.state.deviceId) {
            const toastProps = {
                'message': 'Please select a device!',
                'intent': Intent.WARNING,
            }
            toaster.show(toastProps)
            return
        }
        if (!this.state.imageFile) {
            const toastProps = {
                'message': 'Please select an image file!',
                'intent': Intent.WARNING,
            }
            toaster.show(toastProps)
            return
        }

        const timestamp: string = this.state.uploadTime.toString();
        const filename: string = this.state.deviceId + "-" + timestamp.replace(/\s+/g, '-').toLowerCase();
        const fileBlob: Blob = this.state.imageFile!; // Blobs allow us to pass binary data

        const formData: FormData = new FormData();
        //formData.append('deviceId', this.state.deviceId!)
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
            uploaderState: 2, // Switch to gps data window
            imageFilename: filename,
        }, () => console.log("analysis"))
    }

    uploadGPSFile = async () => {
        if (!this.state.gpsFile) {
            const toastProps = {
                'message': 'Please select a GPS file!',
                'intent': Intent.WARNING,
            }
            toaster.show(toastProps)
            return
        }

        // FETCH FOR GPS DATA -- APPEND TO EXISTING DOC
        // OR, send all together at this point

        this.setState({
            uploaderState: 3, // Done with workflow
        }, () => console.log("analysis"))
    }

    runAnalysis = async () => {
        const formData: FormData = new FormData();
        formData.append('filename', this.state.imageFilename!)
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

    // renderWindowContents() {
    //     if (!this.state.deviceId) {
    //         return (
    //             <DeviceRegisterer
    //                 registerDeviceId={this.registerDeviceId}
    //                 currentDeviceId={this.state.deviceId}
    //             />
    //         )
    //     } else if (!this.state.imageFilename) {
    //         return (
    //             <FileUploader
    //                 registerFile={this.registerImageFile}
    //                 registeredFile={this.state.imageFile}
    //                 uploadFile={this.uploadImageFile}
    //                 uploadString={"Please drag a RoadX image file here or click to select."}
    //             />
    //         )
    //     } else if (!this.state.gpsFile) {
    //         return (
    //             <FileUploader
    //                 registerFile={this.registerGPSFile}
    //                 registeredFile={this.state.gpsFile}
    //                 uploadFile={this.uploadGPSFile}
    //                 uploadString={"Please drag a RoadX GPS file here or click to select."}
    //             />
    //         )
    //     }
    // }
    //
    // render() {
    //     // return (
    //     //     <div className="uploader__container">
    //     //         <div className="uploader__nav">
    //     //             <UploaderNav
    //     //                 states={uploaderStates}
    //     //                 currentState={this.state.uploaderState}
    //     //                 handleUploadStateChange={this.handleUploaderStateChange}
    //     //                 deviceId={this.state.deviceId}
    //     //                 runAnalysis={this.runAnalysis}
    //     //                 canRunAnalysis={!!this.state.imageFilename}
    //     //             />
    //     //         </div>
    //     //         <div className="uploader__window">
    //     //             {this.renderWindowContents()}
    //     //         </div>
    //     //     </div>
    //     // )
    // }
}
