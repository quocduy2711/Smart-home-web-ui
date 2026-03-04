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

    if (!time) return null;

    return (
        <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm border border-neutral-300 px-4 py-2 rounded-full bg-white shadow-sm w-fit">
            <span className="tabular-nums">
                {time.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                })}
            </span>
            <span className="w-px h-4 bg-neutral-300 mx-1" />
            <span className="whitespace-nowrap">
                {time.toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })}
            </span>
        </div>
    );
}