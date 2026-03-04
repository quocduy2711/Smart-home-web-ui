'use server'

import { db } from "@/infra/db";
import { users } from "@/infra/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key-graduation-project");

type ActionState = {
    error?: string;
    success?: boolean;
};

// type ActionState definition removed (already defined above)

import { authUseCase } from "@/core/use-cases/auth";

export async function registerAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return { error: "Vui lòng nhập đầy đủ thông tin" };

    const result = await authUseCase.register(username, password);
    if (!result.success) {
        return { error: result.error };
    }

    return { success: true };
}

export async function loginAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const result = await authUseCase.login(username, password);
    if (result.error) {
        return { error: result.error };
    }

    if (result.token) {
        (await cookies()).set("session", result.token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
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
