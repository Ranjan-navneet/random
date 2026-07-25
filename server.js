import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import letterRoutes from "./routes/letterRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = ["https://bday-preeti.netlify.app/"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/letters", letterRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/media", mediaRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
