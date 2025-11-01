import * as dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env before anything else

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!, // ✅ Use process.env instead of env()
  },
});
