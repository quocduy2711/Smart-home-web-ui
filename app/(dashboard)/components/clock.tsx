"use client";

import { useEffect, useState } from "react";

export function Clock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Prevent hydration mismatch by returning null until mounted
    if (!time) return null;

    return (
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-sm border border-neutral-200 px-3 py-1 rounded-full bg-white shadow-sm">
            <span>
                {time.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                })}
            </span>
            <span className="w-px h-3 bg-neutral-300 mx-1" />
            <span>
                {time.toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                })}
            </span>
        </div>
    );
}
