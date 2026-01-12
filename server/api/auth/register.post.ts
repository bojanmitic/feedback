import { getDb } from "~/server/utils/db";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, phone } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    const db = await getDb();

    // Check if user already exists
    const existingUserResult = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    const existingUser = Array.isArray(existingUserResult)
      ? existingUserResult
      : existingUserResult.rows || [];

    if (existingUser.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.query(
      "INSERT INTO users (email, password, phone) VALUES ($1, $2, $3) RETURNING id, email, phone, created_at",
      [email, hashedPassword, phone || null]
    );

    const rows = Array.isArray(result) ? result : result.rows || [];
    const user = rows[0];

    // Set session cookie (simple approach - in production use proper session management)
    setCookie(event, "user_id", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Registration failed",
    });
  }
});
