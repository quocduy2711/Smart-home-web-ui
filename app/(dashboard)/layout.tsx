import { MqttProvider } from "@/app/context/mqtt-context";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MqttProvider>
            {children}
        </MqttProvider>
    );
}
