import {
  createTaskValidator,
  updateTaskValidator,
} from "../validators/taskValidator.js";
import {
  createTaskService,
  getTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskServices.js";
import * as z from "zod";

let statusCode = 500;

export const createTask = async (req, res) => {
  try {
    const validatedRequest = await createTaskValidator.parseAsync(req.body);

    const task = await createTaskService(validatedRequest);

    statusCode = 201;

    res.status(statusCode).json({
      success: true,
      message: "Task Created successfully!",
      data: task,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const retrievedError = error.issues.map((issue) => {
        // this error is only running if the body is not provided
        if (issue.path.length === 0) {
          statusCode = 502;
          return "Please provide the necessary data";
        }
        return issue.message;
      });

      res.status(statusCode).json({
        success: false,
        ErrorMessage: retrievedError,
      });
    }

    res.status(statusCode).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await getTasksService();

    statusCode = 200;

    res.status(statusCode).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(statusCode).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};

export const getTask = async (req, res) => {
  try {
    const { taskId: id } = req.params; // Grab the ID from the Request
    const task = await getTaskService(Number(id));

    statusCode = 200;

    res.status(statusCode).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    res.status(statusCode).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const validatedRequest = await updateTaskValidator.parseAsync(req.body);

    const { taskId: id } = req.params; // Grab the ID from the Request
    const task = await updateTaskService(Number(id), validatedRequest);

    statusCode = 200;

    res.status(statusCode).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const retrievedError = error.issues.map((issue) => {
        // this error is only running if the body is not provided
        if (issue.path.length === 0) {
          statusCode = 502;
          return "Please provide the necessary data";
        }
        return issue.message;
      });

      res.status(statusCode).json({
        success: false,
        ErrorMessage: retrievedError,
      });
    }

    res.status(statusCode).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId: id } = req.params; // Grab the ID from the Request
    const task = await deleteTaskService(Number(id));

    statusCode = 204;

    res.status(statusCode).json({
      success: true,
      message: "Tasks deleted successfully",
      data: task,
    });
  } catch (error) {
    res.status(statusCode).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};
