"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import mqtt from "mqtt";

const BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || "ws://localhost:9001";
// Default to localhost so it fails (Not Connected) if user hasn't run a broker.
// Previous: "ws://test.mosquitto.org:8080" (Public Test Broker)

type MqttContextType = {
    client: mqtt.MqttClient | null;
    isConnected: boolean;
    payloads: Record<string, string>;
    publish: (topic: string, message: string) => void;
};

const MqttContext = createContext<MqttContextType | null>(null);

export function MqttProvider({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [payloads, setPayloads] = useState<Record<string, string>>({});

    useEffect(() => {
        console.log("Connecting to MQTT Broker...", BROKER_URL);
        const mqttClient = mqtt.connect(BROKER_URL, {
            clean: true,
            connectTimeout: 4000,
            clientId: `nexus_web_${Math.random().toString(16).substr(2, 8)}`,
        });

        mqttClient.on("connect", () => {
            console.log("MQTT Connected");
            setIsConnected(true);
            // Subscribe to all home device statuses
            mqttClient.subscribe("home/+/+/status");
        });

        mqttClient.on("message", (topic, message) => {
            const payload = message.toString();
            // console.log(`Msg: ${topic} -> ${payload}`);
            setPayloads((prev) => ({ ...prev, [topic]: payload }));
        });

        mqttClient.on("close", () => {
            // console.log("MQTT Disconnected");
            setIsConnected(false);
        });

        mqttClient.on("offline", () => {
            // console.log("MQTT Offline");
            setIsConnected(false);
        });

        mqttClient.on("error", (err) => {
            console.error("MQTT Error: ", err);
            mqttClient.end();
        });

        setClient(mqttClient);

        return () => {
            if (mqttClient.connected) {
                mqttClient.end();
            }
        };
    }, []);

    const publish = useCallback((topic: string, message: string) => {
        if (client && client.connected) {
            client.publish(topic, message, (err) => {
                if (err) {
                    console.error("Publish error:", err);
                }
            });
        } else {
            console.warn("MQTT Client not connected. Cannot publish:", topic, message);
        }
    }, [client]);

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
