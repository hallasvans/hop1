import express from "express";
import cors from "cors";
import showsRoutes from "./src/shows.js";
import usersRoutes from "./src/users.js";
import watchlistRoutes from "./src//watchlist.js";
import reviewRoutes from "./src//reviews.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


// API Routes
app.use("/shows", showsRoutes);
app.use("/users", usersRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/reviews", reviewRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Velkomin í sjónvarpsþátta API!",
    routes: {
      shows: "/shows",
      users: "/users",
      watchlist: "/watchlist",
      reviews: "/reviews"
    }
  });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

