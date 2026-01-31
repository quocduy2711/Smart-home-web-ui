
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { devices } from './schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Seed function to ensure devices exist
export async function seedDevices() {
    const existing = await db.select().from(devices);
    if (existing.length > 0) return;

    console.log("Seeding devices...");

    const hardwareList = [
        // Sensors
        { id: 'sensor_temp', name: 'Nhiệt độ (DHT11)', type: 'SENSOR', value: '0', unit: '°C' },
        { id: 'sensor_hum', name: 'Độ ẩm (DHT11)', type: 'SENSOR', value: '0', unit: '%' },
        { id: 'sensor_light', name: 'Ánh sáng', type: 'SENSOR', value: '0', unit: 'Lux' },
        { id: 'sensor_motion', name: 'Chuyển động (PIR)', type: 'SENSOR', value: 'No', unit: '' },

        // Actuators
        { id: 'light_1', name: 'Đèn 1', type: 'LIGHT', value: 'OFF' },
        { id: 'light_2', name: 'Đèn 2', type: 'LIGHT', value: 'OFF' },
        { id: 'light_3', name: 'Đèn 3', type: 'LIGHT', value: 'OFF' },
        { id: 'fan_3v_1', name: 'Quạt Nhỏ 1 (3V)', type: 'FAN', value: 'OFF' },
        { id: 'fan_3v_2', name: 'Quạt Nhỏ 2 (3V)', type: 'FAN', value: 'OFF' },
        { id: 'fan_12v', name: 'Quạt Lớn (12V)', type: 'FAN', value: 'OFF' },
        { id: 'relay_main', name: 'Relay Tổng', type: 'RELAY', value: 'OFF' },

        // Camera
        { id: 'cam_esp32', name: 'ESP32 Camera', type: 'CAMERA', value: 'http://192.168.1.100:81/stream' }
    ];

    for (const dev of hardwareList) {
        await db.insert(devices).values(dev);
    }
}

seedDevices().catch(console.error);
