import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "Set DIRECT_URL (preferred for migrations) or DATABASE_URL in .env / .env.local.",
  );
}

export default defineConfig({
  schema: "backend/prisma/schema.prisma",
  datasource: { url },
  migrations: {
    path: "backend/prisma/migrations",
    seed: "tsx backend/prisma/seed.ts",
  },
});
