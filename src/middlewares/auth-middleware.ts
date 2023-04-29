import jwt from "jsonwebtoken";
import { Request as ExpressRequest, Response, NextFunction } from "express";
import User from "../models/user.model";

interface Request extends ExpressRequest {
  user?: {
    _id: string;
  };
}

// Middleware function to verify the user token
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication failed");
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      _id: string;
    };
    // Find the user in the database based on the decoded token
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("Authentication failed");
    }
    // Attach the user object to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication failed" });
  }
};
