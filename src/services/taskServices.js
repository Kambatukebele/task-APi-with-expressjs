import prisma from "../db/prisma.js";

export const createTaskService = async (body) => {
  const createTask = await prisma.task.create({
    data: body,
  });
  return createTask;
};

export const getTasksService = async (status, limit, offset) => {
  if (status !== undefined) {
    const tasks = await prisma.task.findMany({
      where: { status },
      orderBy: {
        createAt: "desc",
      },
      skip: offset,
      take: limit,
    });
    const count = await prisma.task.count({
      where: { status },
    });
    return { tasks, count };
  }
  const tasks = await prisma.task.findMany({
    orderBy: {
      createAt: "desc",
    },
    skip: offset,
    take: limit,
  });
  const count = await prisma.task.count();
  return { tasks, count };
};

export const getTaskService = async (id) => {
  const getTask = await prisma.task.findUnique({
    where: { id },
  });
  return getTask;
};

export const updateTaskService = async (id, body) => {
  const getTask = await prisma.task.update({
    where: { id },
    data: {
      title: body.title,
      status: body.status,
      due_date: body.due_date,
    },
  });
  return getTask;
};

export const deleteTaskService = async (id) => {
  const deleteTask = await prisma.task.delete({
    where: { id },
  });
  return deleteTask;
};
