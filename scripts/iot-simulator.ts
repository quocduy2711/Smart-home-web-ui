import mqtt from "mqtt";
import Aedes from "aedes";
import { createServer } from "net";
import { createServer as createHttpServer } from "http";
import ws from "websocket-stream";

// 1. Start Embedded MQTT Broker (so we don't need external Mosquitto)
const aedes = new Aedes();
const httpServer = createHttpServer();
ws.createServer({ server: httpServer }, aedes.handle as any);

const PORT = 9001;

httpServer.listen(PORT, function () {
    console.log('💚 Embedded MQTT Broker started on port ' + PORT);
    startSimulator();
});

// Configuration
const BROKER_URL = `ws://localhost:${PORT}`;
const DEVICES = [
    { id: "light_1", roomId: "living", type: "LIGHT", name: "Đèn trần", value: "OFF" },
    { id: "light_2", roomId: "kitchen", type: "LIGHT", name: "Đèn bếp", value: "OFF" },
    { id: "fan_1", roomId: "living", type: "FAN", name: "Quạt trần", value: "OFF" },
    { id: "sensor_temp", roomId: "living", type: "SENSOR", name: "Nhiệt độ", value: "28", unit: "°C" },
    { id: "sensor_humid", roomId: "living", type: "SENSOR", name: "Độ ẩm", value: "65", unit: "%" },
];

function startSimulator() {
    console.log(`🚀 IoT Simulator starting... Connecting to ${BROKER_URL}`);

    const client = mqtt.connect(BROKER_URL);

    client.on("connect", () => {
        console.log("✅ Connected to MQTT Broker!");

        // 1. Subscribe to command topics (Wildcard: home/+/+/set)
        client.subscribe("home/+/+/set", (err) => {
            if (!err) console.log("📡 Listening for device commands...");
        });

        // 2. Publish initial state for all devices
        DEVICES.forEach(dev => {
            publishStatus(dev);
        });

        // 3. Simulate Sensor Data Loop
        setInterval(() => {
            const temp = (25 + Math.random() * 5).toFixed(1); // 25-30°C
            const humid = (60 + Math.random() * 20).toFixed(0); // 60-80%

            updateDeviceValue("sensor_temp", temp);
            updateDeviceValue("sensor_humid", humid);
        }, 5000); // Every 5 seconds
    });

    client.on("message", (topic, message) => {
        const payload = message.toString();
        console.log(`📩 Received Command: ${topic} -> ${payload}`);

        // Topic format: home/{room}/{id}/set
        const parts = topic.split("/");
        if (parts.length === 4 && parts[3] === "set") {
            const devId = parts[2];
            const val = payload; // ON or OFF

            // Simulate Hardware Delay
            setTimeout(() => {
                updateDeviceValue(devId, val);
            }, 500);
        }
    });

    function updateDeviceValue(id: string, val: string) {
        const dev = DEVICES.find(d => d.id === id);
        if (dev) {
            dev.value = val;
            publishStatus(dev);
        }
    }

    function publishStatus(dev: any) {
        // Topic: home/{room}/{id}/status
        const topic = `home/${dev.roomId}/${dev.id}/status`;
        client.publish(topic, dev.value);
        console.log(`📤 Published Update: ${topic} -> ${dev.value}`);
    }

    // Handle errors
    client.on("error", (err) => {
        console.error("❌ MQTT Error:", err);
    });
}

