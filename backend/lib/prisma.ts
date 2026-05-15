import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

function isPostgresJdbcUrl(url: string): boolean {
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

function isAccelerateUrl(url: string): boolean {
  return url.startsWith("prisma+postgres://") || url.startsWith("prisma://");
}

/** How the app talks to Postgres at runtime. Migrations use DIRECT_URL via prisma.config.ts. */
type ResolvedConnection =
  | { mode: "postgres"; url: string }
  | { mode: "accelerate"; url: string };

function resolveRuntimeConnection(): ResolvedConnection {
  const direct = process.env.DIRECT_URL?.trim();
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const forceAccelerate = process.env.PRISMA_FORCE_ACCELERATE === "true";

  if (forceAccelerate && databaseUrl && isAccelerateUrl(databaseUrl)) {
    return { mode: "accelerate", url: databaseUrl };
  }

  // Prefer DIRECT_URL for the app whenever it is a real Postgres URL — same database
  // migrations (`prisma migrate` / `db push`) apply to. This avoids Accelerate pointing
  // at a stale or different Prisma Data Platform database than Supabase.
  if (direct && isPostgresJdbcUrl(direct)) {
    return { mode: "postgres", url: direct };
  }

  if (databaseUrl && isPostgresJdbcUrl(databaseUrl)) {
    return { mode: "postgres", url: databaseUrl };
  }

  if (databaseUrl && isAccelerateUrl(databaseUrl)) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[prisma] Runtime is using Prisma Accelerate without DIRECT_URL. If you see missing-column errors, set DIRECT_URL on the host (e.g. Vercel) to the same Supabase pooler URI you use for migrations.",
      );
    }
    return { mode: "accelerate", url: databaseUrl };
  }

  throw new Error(
    "Set DIRECT_URL (recommended) or DATABASE_URL to a postgresql:// connection string, or prisma+postgres:// for Accelerate. See .env.example.",
  );
}

function getOrCreatePool(url: string): Pool {
  if (!globalForPrisma.pgPool) {
    const max = Number.parseInt(process.env.PG_POOL_MAX ?? "10", 10);
    globalForPrisma.pgPool = new Pool({
      connectionString: url,
      max: Number.isFinite(max) && max > 0 ? max : 10,
    });
  }
  return globalForPrisma.pgPool;
}

function createPrismaClient() {
  const resolved = resolveRuntimeConnection();

  if (resolved.mode === "postgres") {
    return new PrismaClient({
      log: ["error"],
      adapter: new PrismaPg(getOrCreatePool(resolved.url)),
    });
  }

  return new PrismaClient({
    log: ["error"],
    accelerateUrl: resolved.url,
  }).$extends(withAccelerate());
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client as PrismaClient;
  return globalForPrisma.prisma;
}

/** Runtime client — uses DIRECT_URL (Postgres) when set, same DB as migrations. */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma(), prop, receiver);
  },
});
