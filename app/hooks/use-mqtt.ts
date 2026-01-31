
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import mqtt from "mqtt";

const BROKER_URL = "ws://test.mosquitto.org:8080";
// Note: Use ws://test.mosquitto.org:8080 for unencrypted or wss://test.mosquitto.org:8081 for encrypted
// For local Mosquitto: ws://localhost:9001

export function useMqtt() {
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
            console.log(`Msg: ${topic} -> ${payload}`);
            setPayloads((prev) => ({ ...prev, [topic]: payload }));
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
        if (client) {
            client.publish(topic, message);
        }
    }, [client]);

    return { client, isConnected, payloads, publish };
}
