"use client";

import { Activity } from "lucide-react";

interface DataPoint {
    time: string;
    indoor: number;
    outdoor: number;
}

interface WeatherComparisonProps {
    data: DataPoint[];
    location: string;
}

export function WeatherComparison({ data, location }: WeatherComparisonProps) {
    const minTemp = 0;
    const maxTemp = 40;

    // Fixed SVG viewport dimensions
    const svgW = 480;
    const svgH = 200;
    const padLeft = 28;
    const padRight = 30; // Increased padding to prevent label clipping
    const padTop = 15;
    const padBottom = 30; // space for X-axis labels

    const chartW = svgW - padLeft - padRight;
    const chartH = svgH - padTop - padBottom;

    const getX = (i: number) =>
        padLeft + (data.length <= 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);

    const getY = (temp: number) => {
        const clamped = Math.max(minTemp, Math.min(maxTemp, temp));
        return padTop + chartH - ((clamped - minTemp) / (maxTemp - minTemp)) * chartH;
    };

    const currentIndoor = data[data.length - 1]?.indoor ?? 0;
    const currentOutdoor = data[data.length - 1]?.outdoor ?? 0;

    const indoorPath = data
        .map((d, i) => {
            const temp = currentIndoor === 0 ? 0 : d.indoor;
            return `${i === 0 ? "M" : "L"}${getX(i)},${getY(temp)}`;
        })
        .join(" ");

    const outdoorPath = data
        .map((d, i) => `${i === 0 ? "M" : "L"}${getX(i)},${getY(d.outdoor)}`)
        .join(" ");

    // Y-axis grid lines at 0, 10, 20, 30, 40
    const yTicks = [0, 10, 20, 30, 40];

    return (
        <div className="bg-[#1a1c20]/95 backdrop-blur-3xl rounded-[2.5rem] p-6 text-white h-full flex flex-col border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="mb-4 flex-shrink-0">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    PHÂN TÍCH NHIỆT ĐỘ ({location})
                </h3>
                <div className="flex gap-8 items-end">
                    <div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Trong nhà</p>
                        <p className="text-4xl font-black">
                            {currentIndoor.toFixed(1)}<span className="text-sm font-bold text-neutral-500 ml-1">°C</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Ngoài trời</p>
                        <p className="text-4xl font-black">
                            {currentOutdoor.toFixed(1)}<span className="text-sm font-bold text-neutral-500 ml-1">°C</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* SVG Chart */}
            <div className="flex-1 min-h-[200px]">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="overflow-visible"
                >
                    {/* Y-axis grid lines and labels */}
                    {yTicks.map((t) => (
                        <g key={t}>
                            <line
                                x1={padLeft}
                                y1={getY(t)}
                                x2={svgW - padRight}
                                y2={getY(t)}
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="1"
                            />
                            <text
                                x={padLeft - 4}
                                y={getY(t)}
                                textAnchor="end"
                                dominantBaseline="middle"
                                fontSize="9"
                                fill="rgba(255,255,255,0.35)"
                            >
                                {t}°
                            </text>
                        </g>
                    ))}

                    {/* Outdoor Line (Green) */}
                    <path
                        d={outdoorPath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.85"
                        style={{ filter: "drop-shadow(0px 4px 6px rgba(16, 185, 129, 0.4))" }}
                    />

                    {/* Indoor Line (Blue) */}
                    <path
                        d={indoorPath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.85"
                        style={{ filter: "drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.4))" }}
                    />

                    {/* Data points + X-axis labels */}
                    {data.map((d, i) => {
                        const cx = getX(i);
                        const indoorY = getY(currentIndoor === 0 ? 0 : d.indoor);
                        const outdoorY = getY(d.outdoor);
                        const labelY = padTop + chartH + 18;

                        // Fix label alignment for edge points
                        let anchor: "start" | "middle" | "end" = "middle";
                        if (i === 0) anchor = "start";
                        if (i === data.length - 1) anchor = "end";

                        return (
                            <g key={i}>
                                {/* Blue dot (indoor) */}
                                <circle cx={cx} cy={indoorY} r="4" fill="#3b82f6" stroke="#1a1c20" strokeWidth="1.5" />
                                {/* Green dot (outdoor) */}
                                <circle cx={cx} cy={outdoorY} r="4" fill="#10b981" stroke="#1a1c20" strokeWidth="1.5" />
                                {/* X-axis time label */}
                                <text
                                    x={cx}
                                    y={labelY}
                                    textAnchor={anchor}
                                    fontSize="9"
                                    fontWeight="700"
                                    fill="rgba(255,255,255,0.4)"
                                >
                                    {d.time}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </div>
    );
}

