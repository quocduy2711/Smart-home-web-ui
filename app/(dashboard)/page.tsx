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
    const currentYear = new Date().getFullYear(); // Lấy năm 2026 tự động

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-900">
            <Header username={session.username as string} />

            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

                {/* Intro */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                            Xin chào, {session.username as string}
                        </h1>
                        <p className="text-neutral-600 mt-1 font-medium">
                            Hệ thống Smart Home
                        </p>
                        <div className="mt-4">
                            <Clock />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-white-800 rounded-full text-sm font-bold border border-green-200">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        MQTT Not Connected
                    </div>
                </div>

                {/* Camera Feed Section */}
                <section>
                    <h2 className="text-sm font-bold mb-4 text-neutral-600 uppercase tracking-widest">
                        Raspberry Pi Camera
                    </h2>
                    <CameraFeed streamUrl="http://192.168.1.107:81/stream" />
                </section>

                {/* Sensors Grid */}
                <section>
                    <h2 className="text-sm font-bold mb-4 text-neutral-600 uppercase tracking-widest">
                        Cảm Biến Môi Trường
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {allDevices.filter(d => d.type === 'SENSOR').map(d => (
                            <div key={d.id} className="bg-white p-5 rounded-xl shadow-sm border border-neutral-200 flex flex-col items-center justify-center gap-2 hover:border-neutral-400 transition-colors">
                                <span className="text-neutral-500 text-xs font-bold uppercase">{d.name}</span>
                                <span className="text-3xl font-black text-neutral-900">
                                    {d.value || '--'}<small className="text-sm font-bold text-neutral-500 ml-1">{d.unit}</small>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Controls Grid */}
                <section>
                    <h2 className="text-sm font-bold mb-4 text-neutral-600 uppercase tracking-widest">
                        Điều Khiển Thiết Bị
                    </h2>
                    <DeviceGrid initialDevices={allDevices.filter(d => d.type !== 'SENSOR' && d.type !== 'CAMERA')} />
                </section>

                {/* Footer với năm hiện tại */}
                <footer className="pt-8 pb-4 text-center border-t border-neutral-200">
                    <p className="text-neutral-400 text-xs font-medium">
                        © {currentYear} Smart Home UI
                    </p>
                </footer>

            </div>
        </main>
    );
}