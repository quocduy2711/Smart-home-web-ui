"use client";

import { useMqttContext } from "@/app/context/mqtt-context";

// This hook now just re-exports the context values
// This keeps existing components working but using the shared connection
export function useMqtt() {
    return useMqttContext();
}
