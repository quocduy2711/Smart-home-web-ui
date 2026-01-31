
"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";

export function Header({ username }: { username: string }) {
    return (
        <header className="h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">N</div>
                NexusHome
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden md:block text-sm text-neutral-500">Admin: {username}</span>
                <button
                    onClick={() => logoutAction()}
                    className="p-2 hover:bg-neutral-100 rounded-full text-neutral-600 transition-colors"
                    title="Đăng xuất"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
