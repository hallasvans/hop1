import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  // Búa til admin notanda ef hann er ekki þegar til
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        username: "admin",
      },
    });

    console.log("Admin notandi búinn til: admin@example.com / adminpassword");
  } else {
    console.log("Admin notandi er þegar til");
  }

  // Bæta við þáttum úr JSON skrá
  const data = JSON.parse(fs.readFileSync("./prisma/shows.json", "utf-8"));

  for (const show of data) {
    await prisma.show.create({
      data: {
        title: show.title,
        platform: show.platform,
        seasons: Math.floor(show.seasons),
        status: show.status,
        genres: {
          connect: [{ name: show.genre }],
        }
      },
    });
  }

  console.log(`Bætti við ${data.length} þáttum í gagnagrunninn ✅`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
