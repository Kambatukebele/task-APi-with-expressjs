import {
  createTaskValidator,
  updateTaskValidator,
  filterQueryParamsValidator,
} from "../validators/taskValidator.js";
import {
  createTaskService,
  getTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskServices.js";
import * as z from "zod";

export const createTask = async (req, res) => {
  try {
    const validatedRequest = await createTaskValidator.parseAsync(req.body);

    const task = await createTaskService(validatedRequest);

    return res.status(201).json({
      success: true,
      message: "Task Created successfully!",
      data: task,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const retrievedError = error.issues.map((issue) => {
        // this error is only running if the body is not provided
        if (issue.path.length === 0) {
          return "Please provide the necessary data";
        }
        return issue.message;
      });

      return res.status(400).json({
        success: false,
        ErrorMessage: retrievedError,
      });
    }

    return res.status(500).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    /**
     * Adding filter for status, page and limit
     */

    const validatedQueryFilter = await filterQueryParamsValidator.parseAsync(
      req.query,
    );

    const { status, page, limit } = validatedQueryFilter;

    const pageNumber = page;
    const limitNumber = limit;
    const statusQuery = status;
    const offset = (pageNumber - 1) * limitNumber;

    const tasks = await getTasksService(statusQuery, limitNumber, offset);

    const { count, tasks: TASKS } = tasks;

    const totalPages = Math.ceil(count / limitNumber);
    const total = count;

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: TASKS,
      pagination: {
        pageNumber,
        limitNumber,
        total,
        totalPages,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const retrievedError = error.issues.map((issue) => {
        return issue.message;
      });
      return res.status(400).json({
        success: false,
        ErrorMessage: retrievedError,
      });
    }
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const retrievedError = error.issues.map((issue) => {
        // this error is only running if the body is not provided
        if (issue.path.length === 0) {
          return "Please provide the necessary data";
        }
        return issue.message;
      });

      return res.status(400).json({
        success: false,
        ErrorMessage: retrievedError,
      });
    }

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Tasks deleted successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: "Something Went Wrong",
      error,
    });
  }
};
