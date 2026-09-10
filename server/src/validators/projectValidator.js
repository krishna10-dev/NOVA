const { z } = require("zod");

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must contain at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .default(""),

  startDate: z
    .string()
    .optional()
    .nullable(),

  dueDate: z
    .string()
    .optional()
    .nullable()
});

const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must contain at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: z
    .enum(["ACTIVE", "COMPLETED", "ARCHIVED"])
    .optional(),

  startDate: z
    .string()
    .optional()
    .nullable(),

  dueDate: z
    .string()
    .optional()
    .nullable()
});

module.exports = {
  createProjectSchema,
  updateProjectSchema
};