"use client";

import { useState, useEffect } from "react";
import { Device } from "@/core/entities/device"; // Updated import
import { Power, Fan, Lightbulb, Zap } from "lucide-react";
import clsx from "clsx";
import { useMqtt } from "@/app/hooks/use-mqtt";

// type Device removed (using imported interface)

export function DeviceGrid({ initialDevices }: { initialDevices: Device[] }) {
    const [items, setItems] = useState(initialDevices);
    const { isConnected, publish, payloads } = useMqtt();

    useEffect(() => {
        setItems((prevItems) =>
            prevItems.map((dev) => {
                const relevantKey = Object.keys(payloads).find(k => k.includes(dev.id) && k.includes("status"));
                if (relevantKey) return { ...dev, value: payloads[relevantKey] };
                return dev;
            })
        );
    }, [payloads]);

    const toggleDevice = (device: Device) => {
        const newVal = device.value === "ON" ? "OFF" : "ON";
        setItems(prev => prev.map(d => d.id === device.id ? { ...d, value: newVal } : d));
        const topic = `home/${device.roomId || "living"}/${device.id}/set`;
        publish(topic, newVal);
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {items.map((device) => {
                const isOn = device.value === "ON" || device.value === "1";
                const Icon = getIcon(device.type);

                return (
                    <button
                        key={device.id}
                        onClick={() => toggleDevice(device)}
                        className={clsx(
                            "p-6 rounded-[2.5rem] transition-all duration-300 flex flex-col gap-6 text-left relative overflow-hidden group",
                            isOn
                                ? "bg-neutral-900 border border-neutral-800 text-white glow-on scale-[1.03] shadow-xl"
                                : "glass-card hover:bg-white/80"
                        )}
                    >
                        <div className={clsx(
                            "w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                            isOn ? "bg-white text-neutral-900" : "bg-neutral-100 text-neutral-400"
                        )}>
                            <Icon
                                size={28}
                                className={clsx(isOn && device.type === 'FAN' && "animate-spin-slow")}
                            />
                        </div>

                        <div>
                            <h3 className={clsx("font-bold text-lg tracking-tight", isOn ? "text-white" : "text-neutral-800")}>
                                {device.name}
                            </h3>
                            <p className={clsx("text-[10px] font-black uppercase tracking-widest mt-1", isOn ? "text-neutral-400" : "text-neutral-400")}>
                                {isOn ? "• ĐANG BẬT" : "• ĐÃ TẮT"}
                            </p>
                        </div>

                        <div className={clsx(
                            "absolute top-8 right-8 w-2 h-2 rounded-full",
                            isOn ? "bg-green-400 animate-pulse" : "bg-neutral-300"
                        )} />
                    </button>
                );
            })}
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