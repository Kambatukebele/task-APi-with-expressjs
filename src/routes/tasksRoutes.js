import express from "express";
import * as Tasks from "../controllers/tasksController.js";

const router = express.Router();

router.get("/tasks", Tasks.getTasks);
router.post("/tasks", Tasks.createTask);
router.get("/tasks/:taskId", Tasks.getTask);
router.patch("/tasks/:taskId", Tasks.updateTask);
router.delete("/tasks/:taskId", Tasks.deleteTask);

export default router;
