
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { db } from "@/infra/db";
import { devices } from "@/infra/db/schema";
import { DeviceGrid } from "./components/device-grid";
import { Clock } from "./components/clock";
import { Header } from "./components/header";
import { CameraFeed } from "./components/camera-feed";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const allDevices = await db.select().from(devices).all();

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-900">
            <Header username={session.username as string} />

            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

                {/* Intro */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight">Xin chào, {session.username as string}</h1>
                        <p className="text-neutral-500 mt-1">Hệ thống đang hoạt động ổn định.</p>
                        <div className="mt-4">
                            <Clock />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        MQTT Connected
                    </div>
                </div>

                {/* Camera Feed Section - Critical for Hardware Demo */}
                <section>
                    <h2 className="text-lg font-medium mb-4 text-neutral-400 uppercase text-xs tracking-wider">Raspberry Pi Camera</h2>
                    <CameraFeed streamUrl="http://192.168.1.107:81/stream" />
                </section>

                {/* Sensors Grid */}
                <section>
                    <h2 className="text-lg font-medium mb-4 text-neutral-400 uppercase text-xs tracking-wider">Cảm Biến Môi Trường</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {allDevices.filter(d => d.type === 'SENSOR').map(d => (
                            <div key={d.id} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex flex-col items-center justify-center gap-2">
                                <span className="text-neutral-400 text-sm">{d.name}</span>
                                <span className="text-2xl font-semibold text-neutral-800">
                                    {d.value || '--'} <small className="text-sm font-normal text-neutral-400">{d.unit}</small>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Controls Grid */}
                <section>
                    <h2 className="text-lg font-medium mb-4 text-neutral-400 uppercase text-xs tracking-wider">Điều Khiển Thiết Bị</h2>
                    <DeviceGrid initialDevices={allDevices.filter(d => d.type !== 'SENSOR' && d.type !== 'CAMERA')} />
                </section>

            </div>
        </main>
    );
}
