import { prisma } from "../lib/prisma";

async function main() {
  console.log("No seed data yet. Add seeds here as the schema grows.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
