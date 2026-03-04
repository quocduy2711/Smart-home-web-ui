import { userRepository } from "@/infra/repositories/user-repository";
import { User } from "@/core/entities/user";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key-graduation-project");

export class AuthUseCase {
    async register(username: string, password: string): Promise<{ success: boolean; error?: string }> {
        const existing = await userRepository.findByUsername(username);
        if (existing) return { success: false, error: "Tên đăng nhập đã tồn tại" };

        const hashedPassword = await bcrypt.hash(password, 10);

        await userRepository.create({
            username,
            password: hashedPassword,
            email: null,
            isTwoFactorEnabled: false,
            twoFactorCode: null,
            twoFactorExpires: null
        });

        return { success: true };
    }

    async login(username: string, password: string): Promise<{ user?: User; token?: string; error?: string }> {
        const user = await userRepository.findByUsername(username);
        if (!user || !user.password) {
            return { error: "Sai tên đăng nhập hoặc mật khẩu" };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return { error: "Sai tên đăng nhập hoặc mật khẩu" };

        // Generate JWT
        const token = await new SignJWT({ id: user.id, username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(SECRET_KEY);

        return { user, token };
    }
}

export const authUseCase = new AuthUseCase();
