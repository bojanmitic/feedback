import { PGlite } from "@electric-sql/pglite";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

let db: PGlite | null = null;

export async function getDb(): Promise<PGlite> {
  if (!db) {
    // Ensure .data directory exists
    const dataDir = join(process.cwd(), ".data", "pglite");
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // PGlite expects a directory path, not a file path
    db = new PGlite(dataDir);

    // Wait for database to be ready
    await db.waitReady;

    // Initialize schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        emoji TEXT NOT NULL,
        emoji_label TEXT NOT NULL,
        free_text TEXT,
        is_public BOOLEAN DEFAULT false,
        wants_contact BOOLEAN DEFAULT false,
        contact_info TEXT,
        agreed_to_privacy BOOLEAN DEFAULT false,
        user_ip TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  return db;
}
