#include <WiFi.h>
#include <PubSubClient.h>

//--- Cấu hình WiFi & MQTT ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "192.168.1.10"; // IP của Raspberry Pi hoặc máy tính chạy Web
const int mqtt_port = 1883; // Port MQTT (lưu ý: Node.js chạy 9001, nhưng ESP32 dùng thư viện này thường chạy 1883)

//--- Cấu hình Thiết bị ---
const char* device_id = "fan_1";
const char* room_id = "living";
const int RELAY_PIN = 23; // Chân GPIO nối Relay quạt

// Topic
String topic_set = String("home/") + room_id + "/" + device_id + "/set";
String topic_status = String("home/") + room_id + "/" + device_id + "/status";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Mặc định tắt

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
}

void callback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println(msg);

  // Điều khiển Relay
  if (String(topic) == topic_set) {
    if (msg == "ON") {
      digitalWrite(RELAY_PIN, HIGH);
      client.publish(topic_status.c_str(), "ON", true); // Gửi lại trạng thái (Retain=true)
    } else if (msg == "OFF") {
      digitalWrite(RELAY_PIN, LOW);
      client.publish(topic_status.c_str(), "OFF", true);
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
      // Đăng ký nhận lệnh điều khiển
      client.subscribe(topic_set.c_str());
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
