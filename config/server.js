import dotenv from "dotenv";
dotenv.config();

export const host = process.env.HOST || "localhost";
export const port = process.env.PORT || 8080;
