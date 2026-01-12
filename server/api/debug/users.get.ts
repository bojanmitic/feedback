import { getDb } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDb();

    // Get all users (without passwords)
    const result = await db.query(
      "SELECT id, email, phone, created_at FROM users ORDER BY id"
    );

    const rows = Array.isArray(result) ? result : result.rows || [];

    return {
      success: true,
      count: rows.length,
      users: rows,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to get users",
    });
  }
});
