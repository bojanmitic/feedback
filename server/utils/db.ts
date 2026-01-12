import { PGlite } from "@electric-sql/pglite";
import { join } from "path";
import { existsSync, mkdirSync, statSync, readdirSync, rmdirSync } from "fs";

let db: PGlite | null = null;

// Helper function to safely create directory (ignores EEXIST)
// Uses a more defensive approach to handle race conditions
function ensureDirectoryExists(dirPath: string): void {
  // Check if directory already exists
  if (existsSync(dirPath)) {
    // Verify it's actually a directory
    const stats = statSync(dirPath);
    if (!stats.isDirectory()) {
      throw new Error(`${dirPath} exists but is not a directory`);
    }
    // Directory exists and is valid, nothing to do
    return;
  }

  // Directory doesn't exist, create it
  // Use recursive: true which should handle parent directories
  // and not throw EEXIST if directory is created concurrently
  try {
    mkdirSync(dirPath, { recursive: true });
  } catch (error: any) {
    // If directory was created between our check and mkdirSync (race condition),
    // or if it's any error other than EEXIST, handle it
    if (error.code === "EEXIST") {
      // Directory was created by another process/thread, verify it's a directory
      if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
        // All good, directory exists and is valid
        return;
      }
      // EEXIST but not a directory - this is a problem
      throw new Error(`${dirPath} exists but is not a directory`);
    }
    // For any other error, rethrow
    throw error;
  }
}

export async function getDb(): Promise<PGlite> {
  if (!db) {
    const dataDir = join(process.cwd(), ".data", "pglite");
    const parentDir = join(process.cwd(), ".data");

    // Ensure parent directory exists
    ensureDirectoryExists(parentDir);

    // If pglite directory exists and is empty, remove it to let PGlite create it fresh
    // This avoids EEXIST errors from PGlite's internal code
    if (existsSync(dataDir)) {
      try {
        const files = readdirSync(dataDir);
        if (files.length === 0) {
          // Directory is empty - remove it so PGlite can create it
          rmdirSync(dataDir);
        }
      } catch (error: any) {
        // If we can't read/remove, that's fine - directory might have files
        // PGlite will handle it
      }
    }

    // Create PGlite instance - it will create the directory if needed
    db = new PGlite(dataDir);

    // Wait for database to be ready
    await db.waitReady;

    // Initialize schema
    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add first_name and last_name columns if they don't exist (for existing databases)
    try {
      await db.exec(
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100)`
      );
    } catch (e) {
      // Column might already exist, ignore
    }
    try {
      await db.exec(
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100)`
      );
    } catch (e) {
      // Column might already exist, ignore
    }

    // Create feedback table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id),
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
