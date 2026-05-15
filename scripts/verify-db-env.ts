/**
 * Sanity-check DB env before deploy or locally. Does not connect to the database.
 *
 * Usage: npm run verify:db-env
 */
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

function isPostgresJdbc(url: string): boolean {
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

function isAccelerate(url: string): boolean {
  return url.startsWith("prisma+postgres://") || url.startsWith("prisma://");
}

const direct = process.env.DIRECT_URL?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();

let exit = 0;

if (direct && isPostgresJdbc(direct)) {
  console.log("OK: Runtime will prefer DIRECT_URL (PostgreSQL) — aligns with `prisma migrate` / `db push`.");
} else if (databaseUrl && isPostgresJdbc(databaseUrl)) {
  console.log("OK: Runtime will use DATABASE_URL as a PostgreSQL connection string.");
} else if (databaseUrl && isAccelerate(databaseUrl)) {
  console.warn(
    "WARNING: Runtime will use Prisma Accelerate. Ensure it is linked to THIS project’s Supabase DB, or add DIRECT_URL (pooler) so the app always matches your migrated schema.",
  );
  exit = 0;
} else {
  console.error(
    "ERROR: Set DIRECT_URL (Supabase pooler URI, recommended) and/or DATABASE_URL. See .env.example.",
  );
  exit = 1;
}

process.exit(exit);
