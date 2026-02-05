import { db } from "@/infra/db";
import { devices } from "@/infra/db/schema";
import { Device } from "@/core/entities/device";
import { eq } from "drizzle-orm";

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
}

export const deviceUseCase = new DeviceUseCase();
