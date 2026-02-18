import { db, eq, type InferSelectModel } from "@sporty/db";
import { users } from "@sporty/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/Api-response";

export type User = InferSelectModel<typeof users>;

type AuthResult = {
  user: Omit<User, "password">;
  token: string;
};

const sanitizeUser = (user: User): Omit<User, "password"> => {
  const { password: _password, ...safe } = user;
  return safe;
};

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password: string, stored: string) => {
  return bcrypt.compare(password, stored);
};

const signToken = (user: User) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret not configured");
  }
  return jwt.sign({ sub: user.id, email: user.email }, secret, {
    expiresIn: "7d",
  });
};

export const registerUser = async (email: string, password: string) => {
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const [user] = await db
    .insert(users)
    .values({
      email,
      password: await hashPassword(password),
    })
    .returning();
  if (!user) {
    return { message: "User is not found" };
  }
  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

export const getUser = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return sanitizeUser(user);
};

export const generateSocketToken = (user: { id: string; email: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret not configured");
  }
  return jwt.sign(user, secret, {
    expiresIn: "1d",
  });
};

export const verifySocketToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret not configured");
  }
  return jwt.verify(token, secret);
};
