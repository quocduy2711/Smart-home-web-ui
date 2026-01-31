"use client";

import { useState, useEffect } from "react";
import { type devices } from "@/infra/db/schema";
import { Power, Fan, Lightbulb, Zap } from "lucide-react";
import clsx from "clsx";
import { useMqtt } from "@/app/hooks/use-mqtt";

type Device = typeof devices.$inferSelect;

export function DeviceGrid({ initialDevices }: { initialDevices: Device[] }) {
    const [items, setItems] = useState(initialDevices);
    const { isConnected, publish, payloads } = useMqtt();

    // Listen for MQTT updates (Hardware -> Web)
    useEffect(() => {
        setItems((prevItems) =>
            prevItems.map((dev) => {
                // Construct topic based on convention: home/room/dev_id/status 
                // NOTE: For simplicity in this demo, we assume topic structure matches devId or simple mapping
                // Real implementation might need a topic Mapper. 
                // Let's assume topic is "home/living/{dev.id}/status" for now or verify against payloads keys

                // Simpler approach: Check if any payload key contains dev.id
                // Example payload key: "home/living/light_1/status"
                const relevantKey = Object.keys(payloads).find(k => k.includes(dev.id) && k.includes("status"));

                if (relevantKey) {
                    return { ...dev, value: payloads[relevantKey] };
                }
                return dev;
            })
        );
    }, [payloads]);

    const toggleDevice = (device: Device) => {
        const newVal = device.value === "ON" ? "OFF" : "ON";

        // 1. Optimistic UI Update
        setItems(prev => prev.map(d => d.id === device.id ? { ...d, value: newVal } : d));

        // 2. Publish MQTT Command (Web -> Hardware)
        // Topic: home/{room}/{id}/set
        // Using a default room 'living' for now if not set, or generic
        const room = device.roomId || "living";
        const topic = `home/${room}/${device.id}/set`;
        console.log(`Sending ${newVal} to ${topic}`);
        publish(topic, newVal);
    };

    return (
        <div className="space-y-4">
            {!isConnected && (
                <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm mb-4">
                    Đang kết nối tới MQTT Broker... (Chờ xíu nhé)
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((device) => {
                    const isOn = device.value === "ON" || device.value === "1";
                    const Icon = getIcon(device.type);

                    return (
                        <button
                            key={device.id}
                            onClick={() => toggleDevice(device)}
                            className={clsx(
                                "p-6 rounded-2xl transition-all duration-200 flex flex-col gap-4 text-left relative overflow-hidden group border",
                                isOn
                                    ? "bg-neutral-900 border-neutral-900 text-white shadow-lg shadow-neutral-200"
                                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 shadow-sm"
                            )}
                        >
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                isOn ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                            )}>
                                <Icon size={20} />
                            </div>

                            <div>
                                <h3 className="font-medium text-sm md:text-base leading-tight">{device.name}</h3>
                                <p className={clsx("text-xs mt-1", isOn ? "text-neutral-400" : "text-neutral-400")}>
                                    {isOn ? "ĐANG BẬT" : "ĐANG TẮT"}
                                </p>
                            </div>

                            {/* Indicator dot */}
                            <div className={clsx(
                                "absolute top-6 right-6 w-2 h-2 rounded-full",
                                isOn ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-neutral-300"
                            )} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case 'FAN': return Fan;
        case 'LIGHT': return Lightbulb;
        case 'RELAY': return Zap;
        default: return Power;
    }
}
