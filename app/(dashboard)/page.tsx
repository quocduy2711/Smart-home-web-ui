import { deviceUseCase } from "@/core/use-cases/devices";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { DeviceGrid } from "./components/device-grid";
import { Clock } from "./components/clock";
import { Header } from "./components/header";
import { CameraFeed } from "./components/camera-feed";
import { WeatherComparison } from "./components/weather-comparison";
import { MqttStatusBadge } from "./components/mqtt-status-badge";
import { Thermometer, Droplets, Activity } from "lucide-react";
import { getWeatherData } from "@/app/actions-weather";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const allDevices = await deviceUseCase.getAllDevices();
    const weatherData = await getWeatherData();

    // DHT11 Fallback logic
    const dht11TempDevice = allDevices.find(d => d.name.toLowerCase().includes('nhiệt'));
    const dht11TempStr = dht11TempDevice?.value;
    const indoorTemp = (dht11TempStr === null || dht11TempStr === undefined || dht11TempStr === "0") ? 0 : parseFloat(dht11TempStr);

    // Simple history recording (saves every time the page is loaded for this demo)
    if (indoorTemp > 0 && dht11TempDevice) {
        await deviceUseCase.recordHistory(dht11TempDevice.id, indoorTemp.toString());
    }

    // Fetch history from DB (last 5 entries)
    const history = dht11TempDevice ? await deviceUseCase.getDeviceHistory(dht11TempDevice.id, 5) : [];

    // Map history to chart data (limited to 5 points)
    const chartData = history.reverse().map((h, i) => ({
        time: new Date(h.timestamp * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        indoor: parseFloat(h.value),
        outdoor: weatherData.current + (i - 2) // Simple mock for outdoor historical variation
    }));

    // Fill with placeholders if less than 5 points
    while (chartData.length < 5) {
        chartData.unshift({
            time: "--:--",
            indoor: 0,
            outdoor: weatherData.current
        });
    }

    // Always ensure the last point is "Bây giờ"
    if (chartData.length > 0) {
        const last = chartData[chartData.length - 1];
        last.time = "Bây giờ";
        last.indoor = indoorTemp;
        last.outdoor = weatherData.current;
    }

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

                <div className="space-y-10">
                    {/* Hàng 1: Camera & Biểu đồ Nhiệt độ */}
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            Camera & Phân tích Nhiệt độ
                        </h2>
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                            <div className="xl:col-span-7 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl glass-card min-h-[400px]">
                                <CameraFeed streamUrl="http://192.168.1.107:81/stream" />
                            </div>
                            <div className="xl:col-span-5">
                                <WeatherComparison
                                    location="Gò Vấp"
                                    data={chartData}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Hàng 2: Chỉ số Môi trường (Moved from sidebar) */}
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Chỉ số Môi trường</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {allDevices.filter(d => d.type === 'SENSOR').map(d => (
                                <div key={d.id} className="glass-card p-6 rounded-[2rem] flex items-center justify-between group hover:scale-[1.02] transition-transform">
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{d.name}</p>
                                        <p className="text-3xl font-black text-neutral-900 mt-1">
                                            {d.value || '--'}<span className="text-sm font-bold ml-1 text-neutral-400">{d.unit}</span>
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        {d.name.toLowerCase().includes('nhiệt') ? <Thermometer className="text-orange-500" /> :
                                            d.name.toLowerCase().includes('độ ẩm') ? <Droplets className="text-blue-500" /> :
                                                <Activity className="text-emerald-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Hàng 3: Điều khiển thiết bị */}
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Điều khiển nhanh</h2>
                        <DeviceGrid initialDevices={allDevices.filter(d => d.type !== 'SENSOR' && d.type !== 'CAMERA')} />
                    </section>
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