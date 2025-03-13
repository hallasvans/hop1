# Sjónvarpsþátta API - Hópverkefni 1

Þetta er REST API fyrir sjónvarpsþætti, notendaumsjón, og gagnagrunn sem er hýstur á Render.

---

## Uppsetning

1. Klóna repo-ið:
   ```bash
   git clone https://github.com/hallasvans/hop1.git
   cd vef2-2025-hop1
2. Setja upp dependencies:
    npm install
3. Setja upp .env skrá með þessum upplýsingum:
    DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DATABASE"
    JWT_SECRET="Leyndarmálstoken"
4. Keyra Prisma migrations:
    npx prisma migrate dev --name init
5. Keyra forritið:
    npm run dev

## API Endapunktar

Route	Method	Lýsing
/shows	GET	Sækja alla þætti
/shows/:id	GET	Sækja einn þátt eftir ID
/shows	POST	Bæta við nýjum þætti
/shows/:id	PUT	Uppfæra þátt
/shows/:id	DELETE	Eyða þætti
/users/register	POST	Skrá nýjan notanda
/users/login	POST	Skrá notanda inn
/users/profile	GET	Ná í notandaprófíl (krefst token)

## Tæki & Tól

Node.js - Backend framework
Express.js - Vefþjónusta
Prisma ORM - Gagnagrunnstól
PostgreSQL - Gagnagrunnur
Jest - Testun
Render - Hýsing
## Hópur

Halla Þórdís Svansdóttir

## Hýsing á Render
https://hop1.onrender.com
