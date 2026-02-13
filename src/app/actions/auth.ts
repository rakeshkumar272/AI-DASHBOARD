"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret");

export async function signup(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "Missing fields" };
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
        return { error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    const [newUser] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role: "user",
        status: "PENDING",
    }).returning();

    // Create session
    const token = await new SignJWT({ id: newUser.id, role: newUser.role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(JWT_SECRET);

    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return { success: true };
}

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Missing fields" };
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
        return { error: "Invalid credentials" };
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
        return { error: "Invalid credentials" };
    }

    const token = await new SignJWT({ id: user.id, role: user.role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(JWT_SECRET);

    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, avatar: user.avatar } };
}

export async function logout() {
    (await cookies()).delete("token");
    redirect("/login");
}

export async function getSession() {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const [user] = await db.select().from(users).where(eq(users.id, payload.id as string));
        if (!user) return null;

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        return null;
    }
}
