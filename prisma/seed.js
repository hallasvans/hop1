import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Athuga hvort admin notandi sé nú þegar til
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    // Búa til hash-að lykilorð
    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    // Búa til admin notanda
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Admin notandi búinn til: admin@example.com / adminpassword");
  } else {
    console.log("Admin notandi er þegar til");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
