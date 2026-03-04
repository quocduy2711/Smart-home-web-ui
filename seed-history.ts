import { db } from "./infra/db/index";
import { deviceHistory, devices } from "./infra/db/schema";
import { eq } from "drizzle-orm";

async function seedHistory() {
    const allDevices = await db.select().from(devices).all();
    const dht11TempDevice = allDevices.find(d => d.name.toLowerCase().includes('nhiệt'));

    if (!dht11TempDevice) {
        console.log("DHT11 sensor not found");
        return;
    }

    const deviceId = dht11TempDevice.id;

    // Clear existing history for clean slate
    await db.delete(deviceHistory).where(eq(deviceHistory.deviceId, deviceId));

    console.log(`Seeding history for device ${deviceId}...`);

    const now = Math.floor(Date.now() / 1000);
    const oneHour = 3600;

    // Seed 4 previous points
    const historyPoints = [
        { deviceId, value: "24.5", timestamp: now - 4 * oneHour },
        { deviceId, value: "25.1", timestamp: now - 3 * oneHour },
        { deviceId, value: "26.8", timestamp: now - 2 * oneHour },
        { deviceId, value: "26.2", timestamp: now - 1 * oneHour },
        { deviceId, value: "25.9", timestamp: now },
    ];

    for (const point of historyPoints) {
        await db.insert(deviceHistory).values(point);
    }

    console.log("Successfully seeded history.");
}

seedHistory().catch(console.error);
