// File for API Calls

import { FilterSpec, RoadXRecord, ScoredClassification, DefectClassification } from "../types/types";
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
        const sortedRecords: Array<RoadXRecord> = records.sort((a: RoadXRecord, b: RoadXRecord) => {
            if (a.detectionTime > b.detectionTime) {
                return -1
            } else if (a.detectionTime < b.detectionTime) {
                return -1
            } else {
                return Number(a.defectClassifications > b.defectClassifications);
            }
        })
        return sortedRecords
    })
    .catch(err => {
        console.log(err)
        return []
    })
}

function convertJsonToRoadXRecord(key: string, json: {[key: string]: any}): RoadXRecord | null {
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
        detectionTime: convertDiscoveryTimeToDate(json['timestamp']),
        uploadTime: json['uploadTime'],
        image: undefined,
        recordId: key,
    }

    if ('override' in json) {
        record.override = json['override']
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
    });
}  

export async function getImage(id: string): Promise<string> {
    const formData: FormData = new FormData();
    formData.append("id", String(id));
    console.log("HERE")
    return await fetch('http://localhost:5000/getImage', {
        method: 'POST',
        mode: 'cors', // cannot pass headers with no-cors
        body: formData,
        headers: {
           'Accept': 'img/png'
        }
    }).then(response => response.blob())
    .then(image => {
        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(image)
    })
}

export interface ISubmitOverrideParams {
    id: string,
    classificationOverride: DefectClassification
}

export async function submitOverride(params: ISubmitOverrideParams): Promise<boolean> {
    const formData: FormData = new FormData();
    formData.append("id", String(params.id));
    formData.append("classificationOverride", String(params.classificationOverride));
    return await fetch('http://localhost:5000/submitOverride', {
        method: 'POST',
        mode: 'cors',
        body: formData
    }).then(response => {
        response.json()
        return true;
    })
    .catch(reason => {
        console.log(reason)
        return false;
    })
}

export const convertDiscoveryTimeToDate = (discoveryTime: string) => {
    const timeString: string = discoveryTime.substring(0, discoveryTime.length - 4); // Remove extension
    const year: number = Number(timeString.substring(0, 4));
    const month: number = Number(timeString.substring(4, 6));
    const date: number = Number(timeString.substring(6, 8));
    const hour: number = Number(timeString.substring(8, 10));
    const minute: number = Number(timeString.substring(10, 12));
    const second: number = Number(timeString.substring(12, 14));

    const d = new Date();
    d.setFullYear(year, month, date);
    d.setHours(hour, minute, second);
    return d;
}