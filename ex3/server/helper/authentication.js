import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// .env
const SECRET = "91D36B465B639C47BD8C0BB11CA63248";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt, password) => {
  return crypto
    .createHmac("sha256", SECRET)
    .update([salt, password].join("/"))
    .digest("base64");
};
