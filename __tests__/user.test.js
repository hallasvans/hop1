import request from "supertest";
import app from "../server.js"; 
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; 


const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.review.deleteMany();  // Eyða öllum reviews
  await prisma.watchlist.deleteMany();  // Eyða öllum watchlist færslum
  await prisma.user.deleteMany();  // Þá er hægt að eyða notendum
  await prisma.user.create({
    data: {
      username: "testuser",
      email: "test@example.com",
      password: await bcrypt.hash("mypassword", 10), // Tryggja hashed password
    },
  });
});


describe("User API", () => {
  let token;

  test("POST /users/register - Búa til notanda", async () => {
    const res = await request(app).post("/users/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "mypassword"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Notandi búinn til!");
  });

  test("POST /users/login - Skrá notanda inn", async () => {
    const res = await request(app).post("/users/login").send({
      email: "test@example.com",
      password: "mypassword"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("GET /users/profile - Ná í notanda (með token)", async () => {
    const res = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  test("GET /shows - Ná í alla þætti", async () => {
    const res = await request(app).get("/shows");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
