import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(), // Hashed
    email: text('email').unique(), // New: Gmail integration
    isTwoFactorEnabled: integer('is_two_factor_enabled', { mode: 'boolean' }).default(false),
    twoFactorCode: text('two_factor_code'),
    twoFactorExpires: integer('two_factor_expires'),
    createdAt: integer('created_at').notNull(),
});

export const devices = sqliteTable('devices', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'LIGHT'|'FAN'|'SENSOR'|'CAMERA'|'RELAY'
    roomId: text('room_id'),
    value: text('value'),
    unit: text('unit'), // Added unit column
});