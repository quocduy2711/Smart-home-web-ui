import { db } from "@/infra/db";
import { devices, deviceHistory } from "@/infra/db/schema";
import { Device } from "@/core/entities/device";
import { eq, desc } from "drizzle-orm";

export class DeviceUseCase {
    async getAllDevices(): Promise<Device[]> {
        const allDevices = await db.select().from(devices).all();
        // Map DB result to Entity if needed (currently they match)
        return allDevices as unknown as Device[];
    }

    async getDeviceById(id: string): Promise<Device | null> {
        const device = await db.query.devices.findFirst({
            where: eq(devices.id, id)
        });
        return device as unknown as Device | null;
    }

    async toggleDevice(id: string, currentValue: string): Promise<void> {
        // This is mainly handled via MQTT, but we might want to update DB state too
        // simulating the device reporting back status
        const newValue = currentValue === "ON" ? "OFF" : "ON";
        await db.update(devices).set({ value: newValue }).where(eq(devices.id, id));
    }

    async recordHistory(deviceId: string, value: string): Promise<void> {
        await db.insert(deviceHistory).values({
            deviceId,
            value,
            timestamp: Math.floor(Date.now() / 1000)
        });
    }

    async getDeviceHistory(deviceId: string, limit: number = 24): Promise<any[]> {
        return await db.select()
            .from(deviceHistory)
            .where(eq(deviceHistory.deviceId, deviceId))
            .orderBy(desc(deviceHistory.timestamp))
            .limit(limit)
            .all();
    }
}

export const deviceUseCase = new DeviceUseCase();
