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

    const body = await readBody(event);
    const { emoji, emojiLabel, freeText, isPublic, wantsContact, contactInfo, agreedToPrivacy } = body;

    if (!emoji || !emojiLabel || !agreedToPrivacy) {
      throw createError({
        statusCode: 400,
        statusMessage: "Emoji, emoji label, and privacy agreement are required",
      });
    }

    const db = await getDb();

    // Get user IP address
    const userIp = getHeader(event, "x-forwarded-for") || getHeader(event, "x-real-ip") || "unknown";

    // Check if user already has feedback (enforce one feedback per user)
    const existingFeedback = await db.query(
      "SELECT id FROM feedback WHERE user_id = $1",
      [userId]
    );

    const existingRows = Array.isArray(existingFeedback) ? existingFeedback : existingFeedback.rows || [];

    // Get user name for response
    const userResult = await db.query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [userId]
    );
    const userRows = Array.isArray(userResult) ? userResult : userResult.rows || [];
    const user = userRows[0] || {};

    if (existingRows.length > 0) {
      // Update existing feedback
      const result = await db.query(
        `UPDATE feedback 
         SET emoji = $1, emoji_label = $2, free_text = $3, is_public = $4, 
             wants_contact = $5, contact_info = $6, agreed_to_privacy = $7, user_ip = $8
         WHERE user_id = $9
         RETURNING id, emoji, emoji_label, free_text, is_public, wants_contact, created_at`,
        [emoji, emojiLabel, freeText || null, isPublic || false, wantsContact || false, contactInfo || null, agreedToPrivacy, userIp, userId]
      );

      const rows = Array.isArray(result) ? result : result.rows || [];

      return {
        success: true,
        feedback: {
          ...rows[0],
          firstName: user.first_name,
          lastName: user.last_name,
        },
      };
    } else {
      // Insert new feedback
      const result = await db.query(
        `INSERT INTO feedback (user_id, emoji, emoji_label, free_text, is_public, wants_contact, contact_info, agreed_to_privacy, user_ip)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, emoji, emoji_label, free_text, is_public, wants_contact, created_at`,
        [userId, emoji, emojiLabel, freeText || null, isPublic || false, wantsContact || false, contactInfo || null, agreedToPrivacy, userIp]
      );

      const rows = Array.isArray(result) ? result : result.rows || [];

      return {
        success: true,
        feedback: {
          ...rows[0],
          firstName: user.first_name,
          lastName: user.last_name,
        },
      };
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to submit feedback",
    });
  }
});
