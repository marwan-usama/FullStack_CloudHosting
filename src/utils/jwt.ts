import * as jwt from "jsonwebtoken";
import { TokenPayload } from "./types";

// Define the structure of your token's payload (claims)

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
