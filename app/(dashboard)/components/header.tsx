"use client";

import { LogOut, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/app/actions";

export function Header({ username }: { username: string }) {
    return (
        <header className="h-20 border-b border-white/20 bg-white/40 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-neutral-200">
                    <LayoutDashboard size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tighter leading-none">NEXUS</span>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-[0.3em]">HOME OS</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">{username}</span>
                    <span className="text-[10px] text-neutral-400 font-bold">SYSTEM ADMIN</span>
                </div>
                <button
                    onClick={() => logoutAction()}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-neutral-100"
                    title="Đăng xuất"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}