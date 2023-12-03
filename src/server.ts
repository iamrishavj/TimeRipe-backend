import express, { Request, Response } from "express";
import userRoutes from "./api/routes/user.route";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Backend!");
});

// CORS Middleware if you're calling the API from a different domain
//app.use(cors());

// Mounting user routes
app.use("/api/users", userRoutes);

app.listen(4321, () => {
  console.log("Server listening on port 4321");
});
