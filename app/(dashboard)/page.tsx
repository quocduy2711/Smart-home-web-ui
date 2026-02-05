import { deviceUseCase } from "@/core/use-cases/devices";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
// import { db } from "@/infra/db"; // Removed direct db access
// import { devices } from "@/infra/db/schema"; // Removed schema access
import { DeviceGrid } from "./components/device-grid";
import { Clock } from "./components/clock";
import { Header } from "./components/header";
import { CameraFeed } from "./components/camera-feed";
import { MqttStatusBadge } from "./components/mqtt-status-badge";
import { Thermometer, Droplets, Activity } from "lucide-react";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const allDevices = await deviceUseCase.getAllDevices();
    const currentYear = new Date().getFullYear();

    // Dynamic Greeting Logic
    const hour = new Date().getHours();
    let greeting = "Chào buổi sáng";
    if (hour >= 12 && hour < 18) greeting = "Chào buổi chiều";
    else if (hour >= 18 || hour < 5) greeting = "Chào buổi tối";

    return (
        <main className="min-h-screen pb-12">
            <Header username={session.username as string} />

            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">

                {/* Hero Banner */}
                <div className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-neutral-900">
                            {greeting}, {session.username as string}
                        </h1>
                        <p className="text-neutral-500 font-medium mt-2">Hệ thống đang hoạt động ổn định.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <MqttStatusBadge />
                        <Clock />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột Trái: Camera & Thiết bị */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                Camera An Ninh Live
                            </h2>
                            <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl glass-card">
                                <CameraFeed streamUrl="http://192.168.1.107:81/stream" />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Điều khiển nhanh</h2>
                            <DeviceGrid initialDevices={allDevices.filter(d => d.type !== 'SENSOR' && d.type !== 'CAMERA')} />
                        </section>
                    </div>

                    {/* Cột Phải: Cảm biến Sidebar */}
                    <aside className="space-y-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Môi trường</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {allDevices.filter(d => d.type === 'SENSOR').map(d => (
                                <div key={d.id} className="glass-card p-6 rounded-[2rem] flex items-center justify-between group hover:scale-[1.02] transition-transform">
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{d.name}</p>
                                        <p className="text-3xl font-black text-neutral-900 mt-1">
                                            {d.value || '--'}<span className="text-sm font-bold ml-1 text-neutral-400">{d.unit}</span>
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        {d.name.toLowerCase().includes('nhiệt') ? <Thermometer className="text-orange-500" /> : <Droplets className="text-blue-500" />}
                                    </div>
                                </div>
                            ))}
                            {/* Card ảo trang trí thêm */}
                            <div className="glass-card p-6 rounded-[2rem] bg-white text-neutral-900 border border-neutral-200">
                                <Activity size={20} className="mb-4 text-green-500" />
                                <p className="text-xs font-bold opacity-60 uppercase tracking-wider">Trạng Thái Hệ Thống</p>
                                <p className="text-xl font-black">Hoạt động tốt</p>
                            </div>
                        </div>
                    </aside>
                </div>

                <footer className="pt-12 text-center">
                    <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                        © {currentYear} NEXUS HOME OS
                    </p>
                </footer>
            </div>
        </main>
    );
}