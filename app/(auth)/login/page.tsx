"use client";

import { useActionState, useEffect, useState } from "react";
import { loginAction } from "@/app/actions";
import Link from "next/link";

export default function LoginPage() {
    const [state, action] = useActionState(loginAction, null);
    const [isMounted, setIsMounted] = useState(false);

    // Xử lý lỗi Hydration: Đảm bảo component đã mount trên client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                <h1 className="text-2xl font-bold mb-2 text-neutral-900">Đăng Nhập</h1>
                <p className="text-neutral-500 mb-6 text-sm">Điều khiển ngôi nhà thông minh của bạn.</p>

                <form action={action} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-700">Tên đăng nhập</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-neutral-900 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-700">Mật khẩu</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-neutral-900 bg-white"
                        />
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-neutral-900 text-white font-medium py-3 rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                        Vào hệ thống
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Chưa có tài khoản? <Link href="/register" className="text-neutral-900 font-medium hover:underline">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}