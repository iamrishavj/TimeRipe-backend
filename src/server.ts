import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

import userRoutes from "./api/routes/user.route";
import sessionRoutes from "./api/routes/session.route";

import limiter from "./api/middleware/rateLimiter";

const app = express();

app.use(cors());

app.use(limiter);

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Backend!");
});

app.use("/api/user", userRoutes);

app.use("/api/session", sessionRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
