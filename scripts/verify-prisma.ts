import { prisma } from "../lib/prisma";

async function main() {
  try {
    const orgCount = await prisma.organization.count();
    const propertyCount = await prisma.property.count();
    const waitlistCount = await prisma.waitlistEntry.count();
    console.log("Connected to database");
    console.log(`Organizations: ${orgCount}`);
    console.log(`Properties: ${propertyCount}`);
    console.log(`Waitlist entries: ${waitlistCount}`);
  } catch (err) {
    console.error("Prisma verification failed:");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
