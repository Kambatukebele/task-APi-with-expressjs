import express from "express";
import Tasks from "./routes/tasksRoutes.js";

const server = express();

server.use(express.json());
server.use(express.urlencoded());

server.use("/", Tasks);

server.get("/", (req, res) => {
  res.send("Hello there");
});

export default server;
