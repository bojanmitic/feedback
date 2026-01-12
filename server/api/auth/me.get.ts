import { getDb } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const userId = getCookie(event, "user_id");

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not authenticated",
      });
    }

    const db = await getDb();

    const result = await db.query(
      "SELECT id, email, phone, created_at FROM users WHERE id = $1",
      [userId]
    );

    const rows = Array.isArray(result) ? result : result.rows || [];

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return {
      success: true,
      user: rows[0],
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to get user",
    });
  }
});
