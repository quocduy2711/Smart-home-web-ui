
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

export async function registerAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return { error: "Vui lòng nhập đầy đủ thông tin" };

    // Check exist
    const existing = await db.query.users.findFirst({
        where: eq(users.username, username)
    });

    if (existing) return { error: "Tên đăng nhập đã tồn tại" };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
        id: nanoid(),
        username,
        password: hashedPassword,
        createdAt: Date.now()
    });

    return { success: true };
}

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const user = await db.query.users.findFirst({
        where: eq(users.username, username)
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return { error: "Sai tên đăng nhập hoặc mật khẩu" };
    }

    // Create Session
    const token = await new SignJWT({ id: user.id, username: user.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(SECRET_KEY);

    (await cookies()).set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    redirect("/");
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
