import jwt from "jsonwebtoken";
import { TokenPayload } from "./types";

const JWT_SECRET = process.env.JWT_SECRET as string;


export function verifyJwt(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}
