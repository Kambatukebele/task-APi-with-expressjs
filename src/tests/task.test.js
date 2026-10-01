import { describe, it, vi, expect, beforeEach } from "vitest";
import { getTasksService } from "../services/taskServices.js";
import prisma from "../db/prisma.js";

vi.mock("../db/prisma.js", () => ({
  default: {
    task: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("Task Service - getTasksService", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated tasks without a status filter", async () => {
    prisma.task.findMany.mockResolvedValue(fakeTasks);
    prisma.task.count.mockResolvedValue(2);

    const result = await getTasksService(undefined, 2, 0);

    expect(result.tasks).toEqual(fakeTasks);
    expect(result.count).toBe(2);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      orderBy: {
        createAt: "desc",
      },
      skip: 0,
      take: 2,
    });

    expect(prisma.task.count).toHaveBeenCalledWith();
  });

  it("should filter tasks by status", async () => {
    const completedTasks = [
      {
        id: 1,
        title: "Task One",
        status: "Completed",
      },
    ];

    prisma.task.findMany.mockResolvedValue(completedTasks);
    prisma.task.count.mockResolvedValue(1);

    const result = await getTasksService("Completed", 2, 0);

    expect(result.tasks).toEqual(completedTasks);
    expect(result.count).toBe(1);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        status: "Completed",
      },
      orderBy: {
        createAt: "desc",
      },
      skip: 0,
      take: 2,
    });

    expect(prisma.task.count).toHaveBeenCalledWith({
      where: {
        status: "Completed",
      },
    });
  });

  it("should apply the correct offset and limit", async () => {
    prisma.task.findMany.mockResolvedValue(fakeTasks);
    prisma.task.count.mockResolvedValue(10);

    await getTasksService(undefined, 2, 4);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      orderBy: {
        createAt: "desc",
      },
      skip: 4,
      take: 2,
    });
  });
});
