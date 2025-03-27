import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
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

    console.log("Admin notandi búinn til");
  } else {
    console.log("Admin notandi er þegar til");
  }

  const data = JSON.parse(fs.readFileSync("./prisma/shows.json", "utf-8"));

  const uniqueGenres = [...new Set(data.map(show => show.genre))];

  for (const genreName of uniqueGenres) {
    await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });
  }

  console.log(`Bætti við ${uniqueGenres.length} genre(s)`);

  for (const show of data) {
    await prisma.show.upsert({
      where: { title: show.title },
      update: {},
      create: {
        title: show.title,
        platform: show.platform,
        seasons: Math.floor(show.seasons),
        status: show.status,
        genres: {
          connect: [{ name: show.genre }],
        },
      },
    });
  }

  console.log(`Bætti við ${data.length} þáttum 🎉`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
