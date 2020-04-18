// File for API Calls

import { FilterSpec, RoadXRecord, ScoredClassification } from "../types/types";
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
        mode: 'cors', // cannot pass headers with no-cors
        body: formData,
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

export async function analyzeImage(params: IAnalyzeImageParams): Promise<{[key: string]: string}> {
    const formData: FormData = new FormData();
    formData.append('imageBatchUploadId', params.imageBatchUploadId)
    formData.append('gpsUploadId', params.imageBatchUploadId)
    let res: {[key: string]: string} = await fetch('http://localhost:5000/analyzeImage', {
        method: 'POST',
        mode: 'cors', // cannot pass headers with no-cors
        body: formData
    }).then(response => {
        return {"status": String(response.status), "message": "OK"};
    }).catch(reason => {
        return {"status": "500", "message": reason};
    })
    return res;  
}

export async function getDataByFilterSpec(f: FilterSpec) {
    const formData: FormData = new FormData();
    formData.append("minLongitude", String(f.minLongitude));
    formData.append("maxLongitude", String(f.maxLongitude));
    formData.append("minLatitude", String(f.minLatitude));
    formData.append("maxLatitude", String(f.maxLatitude));
    formData.append("threshold", String(f.threshold));
    formData.append("defectClassifications", f.defectClassifications.toString()); // will need to deserialize this to list on backend
    return await fetch('http://localhost:5000/getDataByFilterSpec', {
        method: 'POST',
        mode: 'cors', // cannot pass headers with no-cors
        body: formData,
        headers: {
           'Accept': 'text/plain'
        }
    })
    .then(r => r.json())
    .then(r => {
        const records: Array<RoadXRecord> = []
        for (var key in r) {
            const record: RoadXRecord | null = convertJsonToRoadXRecord(key, r[key]);
            if (record) {
                records.push(record)
            }
            
        }
        return records
    })
    .catch(err => {
        console.log(err)
        return []
    })
}

function convertJsonToRoadXRecord(key: string, json: any): RoadXRecord | null {
    const classificationsAndScores: string[] = json['scores']
    if (classificationsAndScores.length === 0) {
        return null
    }
    const defectClassifications: ScoredClassification[] = classificationsAndScores.map(c => {
        const classification: string = c.split(": ")[0]
        const threshold: string = c.split(": ")[1].replace("%", "")
        return {
            'classification': classification,
            'threshold': +threshold,
        }
    })

    const record: RoadXRecord = {
        latitude: json['latitude'],
        longitude: json['longitude'],
        defectClassifications: defectClassifications,
        detectionTime: json['timestamp'],
        uploadTime: json['uploadTime'],
        image: undefined,
        recordId: key,
    }

    return record;
}

export async function getAllDevices(): Promise<number[]> {
    return await fetch('http://localhost:5000/getDevices', {
        method: 'GET',
        mode: 'cors', 
    })
    .then(response => response.json())
    .then(devices => {
        console.log('Devices', devices)
        const deviceIds: number[] = devices.map((d: any) => Number(d['deviceID']))
        return deviceIds;
    })
    .catch((reason) => {
        console.log(reason);
        return []
    })
}

export interface IAddDeviceParams {
    inputDeviceNum: string,
    devices: number[]
}

export async function addDevice(params: IAddDeviceParams): Promise<boolean> {
    const { inputDeviceNum, devices } = params;
    console.log("DEVICES", devices)
    console.log('Input device num', inputDeviceNum)

    const formData: FormData = new FormData();
    formData.append('deviceId', inputDeviceNum)

    return await fetch('http://localhost:5000/addDevice', {
        method: 'POST',
        mode: 'cors', 
        body: formData,
    }).then(_ => {
        return true;
    }).catch((reason) => {
        console.log(reason);
        return false;
    })
}