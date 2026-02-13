import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);
export const userStatusEnum = pgEnum('user_status', ['PENDING', 'APPROVED', 'REJECTED']);

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: userRoleEnum('role').default('user').notNull(),
    status: userStatusEnum('status').default('PENDING').notNull(),
    joinedDate: timestamp('joined_date').defaultNow().notNull(),
    avatar: text('avatar'),
    password: text('password').notNull(),
});
