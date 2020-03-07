import React from 'react';

const uploaderStates: Array<string> = [
    "Register device",
    "Upload files",
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
    componentWillMount() {
        this.setState({
            uploaderState: 0,
            uploadTime: new Date(),
        })
    }
}