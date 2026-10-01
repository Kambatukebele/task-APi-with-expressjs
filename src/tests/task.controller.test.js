import { describe, it, vi, expect, beforeEach } from "vitest";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController.js";

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

const createResponse = () => {
  const res = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
};

describe("Task Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task and return 201", async () => {
      const req = {
        body: {
          title: "Learn Vitest",
          status: "In_progress",
          due_date: "2026-10-10T10:00:00.000Z",
        },
      };

      const res = createResponse();

      const fakeTask = {
        id: 1,
        title: "Learn Vitest",
        status: "In_progress",
        due_date: "2026-10-10T10:00:00.000Z",
      };

      createTaskService.mockResolvedValue(fakeTask);

      await createTask(req, res);

      expect(createTaskService).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Task Created successfully!",
        data: fakeTask,
      });
    });

    it("should return 400 when validation fails", async () => {
      const req = {
        body: {
          title: "abc",
          status: "Wrong",
          due_date: "wrong-date",
        },
      };

      const res = createResponse();

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();

      expect(createTaskService).not.toHaveBeenCalled();
    });
  });

  describe("getTasks", () => {
    it("should return paginated tasks", async () => {
      const req = {
        query: {
          page: "1",
          limit: "2",
        },
      };

      const res = createResponse();

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

      await getTasks(req, res);

      expect(getTasksService).toHaveBeenCalledWith(undefined, 2, 0);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
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
    });

    it("should apply the status filter", async () => {
      const req = {
        query: {
          status: "Completed",
          page: "2",
          limit: "2",
        },
      };

      const res = createResponse();

      getTasksService.mockResolvedValue({
        tasks: [],
        count: 5,
      });

      await getTasks(req, res);

      expect(getTasksService).toHaveBeenCalledWith("Completed", 2, 2);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 for invalid query parameters", async () => {
      const req = {
        query: {
          page: "0",
          limit: "101",
        },
      };

      const res = createResponse();

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(getTasksService).not.toHaveBeenCalled();
    });
  });

  describe("getTask", () => {
    it("should return one task", async () => {
      const req = {
        params: {
          taskId: "1",
        },
      };

      const res = createResponse();

      const fakeTask = {
        id: 1,
        title: "Learn Vitest",
        status: "In_progress",
      };

      getTaskService.mockResolvedValue(fakeTask);

      await getTask(req, res);

      expect(getTaskService).toHaveBeenCalledWith(1);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Task retrieved successfully",
        data: fakeTask,
      });
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const req = {
        params: {
          taskId: "1",
        },
        body: {
          title: "Updated Task",
          status: "Completed",
        },
      };

      const res = createResponse();

      const fakeTask = {
        id: 1,
        title: "Updated Task",
        status: "Completed",
      };

      updateTaskService.mockResolvedValue(fakeTask);

      await updateTask(req, res);

      expect(updateTaskService).toHaveBeenCalledWith(1, req.body);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Task updated successfully",
        data: fakeTask,
      });
    });

    it("should return 400 when update validation fails", async () => {
      const req = {
        params: {
          taskId: "1",
        },
        body: {
          title: "abc",
        },
      };

      const res = createResponse();

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(updateTaskService).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const req = {
        params: {
          taskId: "1",
        },
      };

      const res = createResponse();

      const deletedTask = {
        id: 1,
        title: "Deleted Task",
        status: "Completed",
      };

      deleteTaskService.mockResolvedValue(deletedTask);

      await deleteTask(req, res);

      expect(deleteTaskService).toHaveBeenCalledWith(1);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Tasks deleted successfully",
        data: deletedTask,
      });
    });
  });
});
