const { z } = require("zod");

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must contain at least 2 characters")
    .max(200, "Task title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .default(""),

  assignedTo: z
    .string()
    .optional()
    .nullable(),

  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional(),

  dueDate: z
    .string()
    .optional()
    .nullable()
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must contain at least 2 characters")
    .max(200, "Task title cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  assignedTo: z
    .string()
    .optional()
    .nullable(),

  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional(),

  dueDate: z
    .string()
    .optional()
    .nullable()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};