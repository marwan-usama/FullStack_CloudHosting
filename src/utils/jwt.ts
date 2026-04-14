import * as jwt from "jsonwebtoken";
import { TokenPayload } from "./types";

// Define the structure of your token's payload (claims)

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

/**
 * Generates a JWT token.
 * @param payload The data to include in the token.
 * @param secretKey The secret key used for signing the token.
 * @param expiresIn The token expiration time (e.g., '1h', '7d').
 * @returns The generated JWT string.
 */

export const generateJwtToken = (
  payload: TokenPayload,
  secretKey: string,
  expiresIn: string | number,
): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: expiresIn,
  });
};
