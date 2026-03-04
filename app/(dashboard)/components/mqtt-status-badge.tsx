"use client";

import { useMqtt } from "@/app/hooks/use-mqtt";

export function MqttStatusBadge() {
    const { isConnected } = useMqtt();

    return (
        <div className={`flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full border transition-all ${isConnected
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-600" : "bg-red-600 animate-pulse"}`} />
            {isConnected ? "MQTT Connected" : "MQTT Not Connected"}
        </div>
    );
}
