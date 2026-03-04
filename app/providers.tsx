"use client";

import React from "react";
import { MqttProvider } from "@/app/context/mqtt-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MqttProvider>{children}</MqttProvider>;
}
