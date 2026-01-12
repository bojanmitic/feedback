import { getDb } from "~/server/utils/db";

export default defineNitroPlugin(async () => {
  // Initialize database on server startup
  try {
    await getDb();
    console.log("[DB] Database initialized successfully");
  } catch (error) {
    console.error("[DB] Failed to initialize database:", error);
    // Don't throw - let the server start, database will be initialized on first request
  }
});
