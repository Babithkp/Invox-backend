// src/index.ts
import express from "express";
import routes from "../routes/index.route.js";
import prisma from "./prismaClient.js"; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get("/", (req: any, res: any) => res.send("Hello World!"));

export default app;