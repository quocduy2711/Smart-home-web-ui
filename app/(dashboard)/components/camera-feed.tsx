"use client";

import React, { useState } from 'react';

export function CameraFeed({ streamUrl }: { streamUrl: string }) {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-sm relative group">
            <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                {/* Fallback when no stream or error */}
                <div className="text-center">
                    <p>RASPBERRY PI STREAM</p>
                    <p className="text-xs opacity-50">{streamUrl}</p>
                    {hasError && <p className="text-xs text-red-400 mt-1">Connection Failed</p>}
                </div>
            </div>
            {/* Real stream */}
            {!hasError && (
                <img
                    src={streamUrl}
                    alt="Live Feed"
                    className="w-full h-full object-cover relative z-10"
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
}
