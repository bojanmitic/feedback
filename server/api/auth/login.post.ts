import { getDb } from "~/server/utils/db";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    const db = await getDb();

    // Find user by email
    const result = await db.query(
      "SELECT id, email, password, phone FROM users WHERE email = $1",
      [email]
    );

    const rows = Array.isArray(result) ? result : result.rows || [];

    if (rows.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    const user = rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    // Set session cookie
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
      statusMessage: error.statusMessage || "Login failed",
    });
  }
});
