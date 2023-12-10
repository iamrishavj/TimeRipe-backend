import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

// Define a custom Request type that includes the user property
interface CustomRequest extends Request {
  user?: JwtPayload | string;
}

const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    if (!decoded) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default authenticateToken;
