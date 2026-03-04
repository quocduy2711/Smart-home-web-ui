"use client";

import { useActionState, useEffect, useState } from "react";
import { registerAction } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [state, action] = useActionState(registerAction, null);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (state?.success) {
            router.push("/login");
        }
    }, [state?.success, router]);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <h1 className="text-2xl font-bold mb-2 text-neutral-900">Tạo Tài Khoản</h1>
                <p className="text-neutral-600 mb-6 text-sm">Dành cho Demo Đồ Án Tốt Nghiệp.</p>

                <form action={action} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-neutral-700">Tên đăng nhập</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-neutral-900 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-neutral-700">Mật khẩu</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-neutral-900 bg-white"
                        />
                    </div>

                    {state?.error && (
                        <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-100">{state.error}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-600 font-medium">
                    Đã có tài khoản? <Link href="/login" className="text-neutral-900 font-bold hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}