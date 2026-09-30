import * as z from "zod";

export const createTaskValidator = z.object({
  title: z
    .string()
    .min(5, { message: "The title must be at least 5 characters" })
    .max(50, { message: "The Title can not have more than 50 characters" }),
  status: z.enum(
    ["Not_started", "In_progress", "Blocked", "Completed", "Cancelled"],
    {
      message:
        "The status can only accept one of the following: Not_started, In_progress, Blocked, Completed, Cancelled",
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
      message:
        "The status can only accept one of the following: Not_started, In_progress, Blocked, Completed, Cancelled",
    })
    .optional(),
  due_date: z.iso.datetime({ error: "Your date format is wrong" }).optional(),
});

export const filterQueryParamsValidator = z.object({
  status: z
    .enum(["Not_started", "In_progress", "Blocked", "Completed", "Cancelled"], {
      message:
        "The status query param can only accept one of the following: Not_started, In_progress, Blocked, Completed, Cancelled",
    })
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
