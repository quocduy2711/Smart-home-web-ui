
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(), // Hashed
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
