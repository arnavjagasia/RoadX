// File for API Calls

import { FilterSpec, RoadXRecord } from "../types/types";

// /create
export interface ICreateParams {
    timestamp: string, 
    imageBatchUploadId: string,
    imageFile: Blob,
    gpsUploadId: string,
    gpsFile: Blob,
    deviceId: string,
}

export async function create(params: ICreateParams) {
    const formData: FormData = new FormData();
    formData.append('deviceId', params.deviceId)
    formData.append('timestamp', params.timestamp)
    formData.append('imageBatchUploadId', params.imageBatchUploadId)
    formData.append('imageFile', params.imageFile)
    formData.append('gpsUploadId', params.gpsUploadId)
    formData.append('gpsFile', params.gpsFile)

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
        'imageBatchUploadId': params.imageBatchUploadId,
        'gpsUploadId': params.gpsUploadId
    }
}

// /analyzeImage
export interface IAnalyzeImageParams {
    imageBatchUploadId: string,
    gpsUploadId: string,
}

export async function analyzeImage(params: IAnalyzeImageParams) {
    const formData: FormData = new FormData();
    formData.append('imageBatchUploadId', params.imageBatchUploadId)
    formData.append('gpsUploadId', params.imageBatchUploadId)
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

export async function getDataByFilterSpec(f: FilterSpec) {
    const formData: FormData = new FormData();
    formData.append("minLongitude", String(f.minLongitude));
    formData.append("maxLongitude", String(f.maxLongitude));
    formData.append("minLatitude", String(f.minLatitude));
    formData.append("maxLatitude", String(f.maxLatitude));
    formData.append("threshold", String(f.threshold));
    formData.append("defectClassifications", String(f.defectClassifications)); // will need to deserialize this to list on backend
    return await fetch('http://localhost:5000/getAllByFilter', {
        method: 'POST',
        mode: 'no-cors', // cannot pass headers with no-cors
        body: formData
    }).then(response => {
        console.log(response)
        return response.json() // Make sure this actually returns data
    }).then(data => {
        return data;
    })
}