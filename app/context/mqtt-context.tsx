"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type MqttContextType = {
    client: any | null; // Removed actual mqtt.MqttClient dependency
    isConnected: boolean;
    payloads: Record<string, string>;
    publish: (topic: string, message: string) => void;
};

const MqttContext = createContext<MqttContextType | null>(null);

export function MqttProvider({ children }: { children: ReactNode }) {
    // Mock state for frontend-only
    const [client] = useState<any | null>(null);
    const [isConnected] = useState(false);
    const [payloads] = useState<Record<string, string>>({});

    const publish = useCallback((topic: string, message: string) => {
        console.warn("Mock MQTT Context: publish called, but no actual broker registered.", topic, message);
    }, []);

    return (
        <MqttContext.Provider value={{ client, isConnected, payloads, publish }}>
            {children}
        </MqttContext.Provider>
    );
}

export function useMqttContext() {
    const context = useContext(MqttContext);
    if (!context) {
        throw new Error("useMqttContext must be used within a MqttProvider");
    }
    return context;
}
