import { db } from "../infra/db";
import { devices } from "../infra/db/schema";
import { eq, or, like } from "drizzle-orm";

async function cleanup() {
    console.log("🧹 Starting DB Cleanup...");

    // Delete devices with type 'RELAY' or name containing 'Relay'
    const deleted = await db.delete(devices)
        .where(
            or(
                eq(devices.type, 'RELAY'), // If type was stored as RELAY
                like(devices.name, '%Relay%') // Or if name matches
            )
        )
        .returning();

    console.log(`✅ Deleted ${deleted.length} devices:`);
    deleted.forEach(d => console.log(` - ${d.name} (${d.type})`));
}

cleanup().then(() => {
    console.log("🎉 Cleanup complete!");
    process.exit(0);
}).catch(err => {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
});
