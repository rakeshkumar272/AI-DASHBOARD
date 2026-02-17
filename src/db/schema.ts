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

export const documentTypeEnum = pgEnum('document_type', ['PDF', 'TEXT']);

export const documents = pgTable('documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    type: documentTypeEnum('type').default('TEXT').notNull(),
    content: text('content').notNull(), // Extracted text
    size: text('size'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);

export const messages = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
