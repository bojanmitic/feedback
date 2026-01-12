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
      `SELECT f.id, f.emoji, f.emoji_label, f.free_text, f.is_public, f.wants_contact, f.contact_info, f.agreed_to_privacy, f.created_at,
              u.first_name, u.last_name
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       WHERE f.user_id = $1`,
      [userId]
    );

    const rows = Array.isArray(result) ? result : result.rows || [];

    if (rows.length === 0) {
      return {
        success: true,
        hasFeedback: false,
        feedback: null,
      };
    }

    const feedback = rows[0];
    return {
      success: true,
      hasFeedback: true,
      feedback: {
        ...feedback,
        firstName: feedback.first_name,
        lastName: feedback.last_name,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to get feedback",
    });
  }
});
