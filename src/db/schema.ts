import { pgTable, text, timestamp, uuid, pgEnum, vector, jsonb, boolean } from 'drizzle-orm/pg-core';

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

export const workspaces = pgTable('workspaces', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentTypeEnum = pgEnum('document_type', ['PDF', 'TEXT']);
export const documentStatusEnum = pgEnum('document_status', ['UPLOADING', 'PROCESSING', 'PENDING', 'INDEXED', 'FAILED']);

export const documents = pgTable('documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: documentTypeEnum('type').default('TEXT').notNull(),
    status: documentStatusEnum('status').default('PENDING').notNull(),
    content: text('content').notNull(), // Extracted text
    size: text('size'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const embeddings = pgTable('embeddings', {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
    documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
    content: text('content').notNull(),
    metadata: jsonb('metadata'),
    vector: vector('vector', { dimensions: 3072 }), // gemini-embedding-001 is 3072
});

export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);

export const messages = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
    documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    sources: jsonb('sources'), // For storing citations (docs + web)
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
