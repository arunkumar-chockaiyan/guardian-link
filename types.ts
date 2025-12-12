export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface UserProfile {
  name: string;
  medicalConditions: string;
  address: string; // Manually entered or reverse geocoded
  isResponder: boolean;
  responderSkills: string;
}

export enum EmergencyStepStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface EmergencyActionState {
  call911: EmergencyStepStatus;
  locateHospital: EmergencyStepStatus;
  notifyContacts: EmergencyStepStatus;
  pageResponders: EmergencyStepStatus;
  hospitalData?: {
    name: string;
    address: string;
  };
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  source: 'SYSTEM' | 'AI' | 'USER';
}