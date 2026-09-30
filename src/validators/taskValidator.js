import * as z from "zod";

export const createTaskValidator = z.object({
  title: z
    .string()
    .min(5, { message: "The title must be at least 5 characters" })
    .max(50, { message: "The Title can not have more than 50 characters" }),
  status: z.enum(
    ["Not_started", "In_progress", "Blocked", "Completed", "Cancelled"],
    {
      errorMap: () => ({
        message:
          "The status can only accept one of the following: Not_started, In_progress, Blocked, Completed, Cancelled",
      }),
    },
  ),
  due_date: z.iso.datetime({ error: "Your date format is wrong" }),
});

export const updateTaskValidator = z.object({
  title: z
    .string()
    .min(5, { message: "The title must be at least 5 characters" })
    .max(50, { message: "The Title can not have more than 50 characters" })
    .optional(),
  status: z
    .enum(["Not_started", "In_progress", "Blocked", "Completed", "Cancelled"], {
      errorMap: () => ({
        message:
          "The status can only accept one of the following: Not_started, In_progress, Blocked, Completed, Cancelled",
      }),
    })
    .optional(),
  due_date: z.iso.datetime({ error: "Your date format is wrong" }).optional(),
});
