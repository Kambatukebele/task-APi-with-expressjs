import dotenv from "dotenv";
dotenv.config();

const ENV = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default ENV;
