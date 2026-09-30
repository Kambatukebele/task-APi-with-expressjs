import prisma from "../db/prisma";

export const createTaskService = async (body) => {
  const createTask = await prisma.task.create({
    data: body,
  });
  return createTask;
};

export const getTasksService = async () => {
  const getTasks = await prisma.task.findMany();
  return getTasks;
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
