import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

import {
  createTaskService,
  getTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskServices.js";

vi.mock("../services/taskServices.js", () => ({
  createTaskService: vi.fn(),
  getTasksService: vi.fn(),
  getTaskService: vi.fn(),
  updateTaskService: vi.fn(),
  deleteTaskService: vi.fn(),
}));

describe("Task API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // POST /tasks
  // ==========================================

  describe("POST /tasks", () => {
    it("should create a task", async () => {
      const fakeTask = {
        id: 1,
        title: "Learn Vitest",
        status: "In_progress",
        due_date: "2026-10-10T10:00:00.000Z",
      };

      createTaskService.mockResolvedValue(fakeTask);

      const response = await request(app).post("/tasks").send({
        title: "Learn Vitest",
        status: "In_progress",
        due_date: "2026-10-10T10:00:00.000Z",
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Task Created successfully!",
        data: fakeTask,
      });

      expect(createTaskService).toHaveBeenCalledWith({
        title: "Learn Vitest",
        status: "In_progress",
        due_date: "2026-10-10T10:00:00.000Z",
      });
    });

    it("should return 400 when task data is invalid", async () => {
      const response = await request(app).post("/tasks").send({
        title: "abc",
        status: "Wrong",
        due_date: "not-a-date",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(createTaskService).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // GET /tasks
  // ==========================================

  describe("GET /tasks", () => {
    it("should return paginated tasks", async () => {
      const fakeTasks = [
        {
          id: 1,
          title: "Task One",
          status: "Completed",
        },
        {
          id: 2,
          title: "Task Two",
          status: "In_progress",
        },
      ];

      getTasksService.mockResolvedValue({
        tasks: fakeTasks,
        count: 10,
      });

      const response = await request(app).get("/tasks").query({
        page: 1,
        limit: 2,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Tasks retrieved successfully",
        data: fakeTasks,
        pagination: {
          pageNumber: 1,
          limitNumber: 2,
          total: 10,
          totalPages: 5,
        },
      });

      expect(getTasksService).toHaveBeenCalledWith(undefined, 2, 0);
    });

    it("should filter tasks by status", async () => {
      const fakeTasks = [
        {
          id: 1,
          title: "Completed Task",
          status: "Completed",
        },
      ];

      getTasksService.mockResolvedValue({
        tasks: fakeTasks,
        count: 1,
      });

      const response = await request(app).get("/tasks").query({
        status: "Completed",
        page: 1,
        limit: 10,
      });

      expect(response.status).toBe(200);

      expect(response.body.data).toEqual(fakeTasks);

      expect(getTasksService).toHaveBeenCalledWith("Completed", 10, 0);
    });

    it("should return 400 for invalid query parameters", async () => {
      const response = await request(app).get("/tasks").query({
        page: 0,
        limit: 101,
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(getTasksService).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // GET /tasks/:taskId
  // ==========================================

  describe("GET /tasks/:taskId", () => {
    it("should return one task", async () => {
      const fakeTask = {
        id: 1,
        title: "Learn Vitest",
        status: "In_progress",
      };

      getTaskService.mockResolvedValue(fakeTask);

      const response = await request(app).get("/tasks/1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Task retrieved successfully",
        data: fakeTask,
      });

      expect(getTaskService).toHaveBeenCalledWith(1);
    });
  });

  // ==========================================
  // PATCH /tasks/:taskId
  // ==========================================

  describe("PATCH /tasks/:taskId", () => {
    it("should update a task", async () => {
      const fakeTask = {
        id: 1,
        title: "Updated Task",
        status: "Completed",
      };

      updateTaskService.mockResolvedValue(fakeTask);

      const response = await request(app).patch("/tasks/1").send({
        title: "Updated Task",
        status: "Completed",
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Task updated successfully",
        data: fakeTask,
      });

      expect(updateTaskService).toHaveBeenCalledWith(1, {
        title: "Updated Task",
        status: "Completed",
      });
    });

    it("should return 400 when update data is invalid", async () => {
      const response = await request(app).patch("/tasks/1").send({
        title: "abc",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(updateTaskService).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // DELETE /tasks/:taskId
  // ==========================================

  describe("DELETE /tasks/:taskId", () => {
    it("should delete a task", async () => {
      const deletedTask = {
        id: 1,
        title: "Deleted Task",
        status: "Completed",
      };

      deleteTaskService.mockResolvedValue(deletedTask);

      const response = await request(app).delete("/tasks/1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Tasks deleted successfully",
        data: deletedTask,
      });

      expect(deleteTaskService).toHaveBeenCalledWith(1);
    });
  });
});
