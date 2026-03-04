import { db } from "@/infra/db";
import { users } from "@/infra/db/schema";
import { User } from "@/core/entities/user";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export class UserRepository {
    async findByUsername(username: string): Promise<User | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.username, username)
        });
        return result as User | null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.email, email)
        });
        return result as User | null;
    }

    async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
        const newUser = {
            ...user,
            id: nanoid(),
            createdAt: Date.now(),
            // Ensure mandatory fields for DB
            password: user.password!,
        };

        await db.insert(users).values(newUser as any);
        return newUser;
    }

    async updateTwoFactor(userId: string, code: string, expires: number): Promise<void> {
        await db.update(users)
            .set({ twoFactorCode: code, twoFactorExpires: expires })
            .where(eq(users.id, userId));
    }
}

export const userRepository = new UserRepository();
