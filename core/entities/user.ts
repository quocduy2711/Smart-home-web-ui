export interface User {
    id: string;
    username: string;
    password?: string; // Optional because we might not pass it around in UI
    email?: string | null;
    isTwoFactorEnabled: boolean;
    twoFactorCode?: string | null;
    twoFactorExpires?: number | null; // Timestamp
    createdAt: number; // Timestamp
}
