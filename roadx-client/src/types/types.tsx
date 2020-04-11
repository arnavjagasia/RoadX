
// RoadX Data Types

export type DefectClassification = string;
export const POTHOLE: DefectClassification = "Pothole";
export const LONGITUDINAL_CRACK: DefectClassification = "Longitudinal Crack";
export const LATERAL_CRACK: DefectClassification = "Lateral Crack";
export const ALLIGATOR_CRACK: DefectClassification = "Alligator Crack";
export const ALL_DEFECTS: Array<DefectClassification> = [POTHOLE, LONGITUDINAL_CRACK, LATERAL_CRACK, ALLIGATOR_CRACK]

export interface ScoredClassification {
    classification: DefectClassification;
    threshold: number;
}

export interface RoadXRecord {
    latitude: number,
    longitude: number,
    defectClassifications: Array<ScoredClassification>,
    detectionTime: string,
    uploadTime: string,
    image: Blob,
    recordId: string,
}

// Filter Types

export interface FilterSpec {
    minLatitude: number;
    minLongitude: number;
    maxLatitude: number;
    maxLongitude: number;
    defectClassifications: Array<DefectClassification>;
    threshold: number;
}

// View modes
export type DataDisplayMode = string;
export const MAP_MODE: DataDisplayMode = "MAP_MODE";
export const LIST_MODE: DataDisplayMode = "LIST_MODE";