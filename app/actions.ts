'use server'

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types";
import { nanoid } from "nanoid";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key-graduation-project");

type ActionState = {
    error?: string;
    success?: boolean;
};

// Mock user store for demonstration purposes
const MOCK_USERS: Record<string, User> = {
    admin: {
        id: "mock-admin-id",
        username: "admin",
        password: "password", // Highly insecure, just for mocking!
        isTwoFactorEnabled: false,
        createdAt: Date.now()
    }
};

export async function registerAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return { error: "Vui lòng nhập đầy đủ thông tin" };

    if (MOCK_USERS[username]) {
        return { error: "Tên đăng nhập đã tồn tại" };
    }

    // Mock registration success
    MOCK_USERS[username] = {
        id: nanoid(),
        username,
        password,
        isTwoFactorEnabled: false,
        createdAt: Date.now()
    };

    return { success: true };
}

export async function loginAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const user = MOCK_USERS[username];

    if (!user || user.password !== password) {
         return { error: "Tên đăng nhập hoặc mật khẩu không chính xác" };
    }

    const token = await new SignJWT({ userId: user.id, username: user.username })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(SECRET_KEY);

    if (token) {
        (await cookies()).set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        redirect("/");
    }

    return { error: "Lỗi không xác định" };
}

export async function logoutAction() {
    (await cookies()).delete("session");
    redirect("/login");
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}
