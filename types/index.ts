export type DeviceType = 'LIGHT' | 'FAN' | 'SENSOR' | 'CAMERA';

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    roomId: string | null;
    value: string | null;
    unit: string | null;
}

export interface User {
    id: string;
    username: string;
    password?: string; // Optional because we might not pass it around in UI
    email?: string | null;
    isTwoFactorEnabled: boolean;
    twoFactorCode?: string | null;
    twoFactorExpires?: number | null; // Timestamp
    createdAt: number; // Timestamp
}
