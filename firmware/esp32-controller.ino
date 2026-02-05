#include <WiFi.h>
#include <PubSubClient.h>

//--- Cấu hình WiFi & MQTT ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "192.168.1.10"; // IP của Raspberry Pi/Laptop
const int mqtt_port = 1883;

//--- Cấu hình Các Thiết Bị ---
// Định nghĩa cấu trúc thiết bị để dễ quản lý nhiều cái
struct Device {
  String id;      // ID trong code Web (ví dụ: light_1)
  String roomId;  // Phòng (ví dụ: living)
  int pin;        // Chân GPIO trên ESP32
};

// Danh sách thiết bị (Khớp với Web App của bạn)
Device devices[] = {
  { "light_1", "living", 26 }, // Đèn trần (GPIO 26)
  { "light_2", "kitchen", 27 }, // Đèn bếp (GPIO 27)
  { "fan_1",   "living", 25 }  // Quạt trần (GPIO 25)
};
const int deviceCount = sizeof(devices) / sizeof(devices[0]);

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Khởi tạo các chân GPIO
  for (int i = 0; i < deviceCount; i++) {
    pinMode(devices[i].pin, OUTPUT);
    digitalWrite(devices[i].pin, LOW); // Mặc định tắt
  }
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
  String topicStr = String(topic);
  
  Serial.print("Message: [");
  Serial.print(topicStr);
  Serial.print("] -> ");
  Serial.println(msg);

  // Duyệt qua danh sách thiết bị để xem lệnh này dành cho ai
  for (int i = 0; i < deviceCount; i++) {
    // Tạo topic lắng nghe của thiết bị đó: home/{roomId}/{id}/set
    String setTopic = String("home/") + devices[i].roomId + "/" + devices[i].id + "/set";
    
    if (topicStr == setTopic) {
      // Đúng là lệnh cho thiết bị này rồi!
      if (msg == "ON") {
        digitalWrite(devices[i].pin, HIGH); // Bật điện
        // Gửi xác nhận về Web: home/{roomId}/{id}/status
        String statusTopic = String("home/") + devices[i].roomId + "/" + devices[i].id + "/status";
        client.publish(statusTopic.c_str(), "ON", true);
        Serial.println("Action: ON " + devices[i].id);
      } 
      else if (msg == "OFF") {
        digitalWrite(devices[i].pin, LOW); // Tắt điện
        String statusTopic = String("home/") + devices[i].roomId + "/" + devices[i].id + "/status";
        client.publish(statusTopic.c_str(), "OFF", true);
        Serial.println("Action: OFF " + devices[i].id);
      }
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Tạo client ID ngẫu nhiên để không bị đá
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Đăng ký nhận lệnh cho TẤT CẢ thiết bị
      // Cách 1: Subscribe từng cái
      for (int i = 0; i < deviceCount; i++) {
        String setTopic = String("home/") + devices[i].roomId + "/" + devices[i].id + "/set";
        client.subscribe(setTopic.c_str());
        Serial.println("Subscribed to: " + setTopic);
      }
      // Cách 2: Subscribe wildcard (tiện hơn nhưng phải lọc kỹ ở callback)
      // client.subscribe("home/+/+/set");
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
