import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const costsSchema = z.object({
  seeds: z.number().min(0).default(0),
  fertilizer: z.number().min(0).default(0),
  pesticides: z.number().min(0).default(0),
  labor: z.number().min(0).default(0),
  irrigation: z.number().min(0).default(0),
  equipment: z.number().min(0).default(0),
  transport: z.number().min(0).default(0),
  miscellaneous: z.number().min(0).default(0),
});

export const estimateSchema = z.object({
  cropId: z.string().min(1, "Crop ID is required"),
  regionId: z.string().min(1, "Region ID is required"),
  landSizeAcres: z.number().positive("Land size must be a positive number"),
  irrigationType: z.string().min(1, "Irrigation type is required"),
  costs: costsSchema,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type EstimateSchemaType = z.infer<typeof estimateSchema>;
