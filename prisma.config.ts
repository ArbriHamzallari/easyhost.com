import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  db: {
    // Direct Postgres URL used by Prisma Migrate (db push, migrate dev/deploy).
    // At runtime, PrismaClient uses the Accelerate URL passed via accelerateUrl
    // in lib/prisma.ts — this is only for CLI migration commands.
    url: process.env.DIRECT_URL!,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
