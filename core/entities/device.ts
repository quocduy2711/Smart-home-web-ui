export type DeviceType = 'LIGHT' | 'FAN' | 'SENSOR' | 'CAMERA' | 'RELAY';

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    roomId: string | null;
    value: string | null;
    unit: string | null;
}
