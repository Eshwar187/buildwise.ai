import { z } from "zod"

export const trimString = z.string().trim()

export const nonEmptyString = trimString.min(1, "This field is required")

export const coercedNumber = (fieldName: string) =>
  z.coerce
    .number({ invalid_type_error: `${fieldName} must be a number` })
    .finite(`${fieldName} must be a valid number`)

export const authSignInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const authSignUpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  name: z.string().trim().optional(),
})

export const projectDimensionsSchema = z.object({
  length: coercedNumber("Land length").positive("Land length must be greater than 0"),
  width: coercedNumber("Land width").positive("Land width must be greater than 0"),
  totalArea: coercedNumber("Total area").optional(),
})

export const projectCreateSchema = z.object({
  name: nonEmptyString,
  description: nonEmptyString,
  landDimensions: projectDimensionsSchema,
  landUnit: z.string().trim().min(1).default("sq ft").optional(),
  budget: coercedNumber("Budget").positive("Budget must be greater than 0"),
  currency: z.string().trim().min(1).default("USD").optional(),
  location: z
    .object({
      country: z.string().trim().default(""),
      state: z.string().trim().default(""),
      city: z.string().trim().default(""),
      region: z.string().trim().optional(),
    })
    .default({ country: "", state: "", city: "" }),
  preferences: z
    .object({
      rooms: z
        .object({
          bedrooms: z.number().int().nonnegative().default(2),
          bathrooms: z.number().int().nonnegative().default(2),
          kitchen: z.boolean().default(true),
          livingRoom: z.boolean().default(true),
          diningRoom: z.boolean().default(true),
          study: z.boolean().default(false),
          garage: z.boolean().default(false),
          additionalRooms: z.array(z.string()).default([]),
        })
        .default({
          bedrooms: 2,
          bathrooms: 2,
          kitchen: true,
          livingRoom: true,
          diningRoom: true,
          study: false,
          garage: false,
          additionalRooms: [],
        }),
      style: z.string().trim().default("Modern").optional(),
      stories: z.number().int().positive().default(1),
      energyEfficient: z.boolean().default(true),
      accessibility: z.boolean().default(false),
      outdoorSpace: z.boolean().default(true),
    })
    .default({
      rooms: {
        bedrooms: 2,
        bathrooms: 2,
        kitchen: true,
        livingRoom: true,
        diningRoom: true,
        study: false,
        garage: false,
        additionalRooms: [],
      },
      style: "Modern",
      stories: 1,
      energyEfficient: true,
      accessibility: false,
      outdoorSpace: true,
    }),
  floorPlanTemplateId: z.string().trim().optional(),
  floorPlan: z
    .object({
      imageUrl: z.string().trim().min(1),
      aiPrompt: z.string().trim().optional(),
      description: z.string().trim().optional(),
      generatedBy: z.string().trim().optional(),
    })
    .optional(),
})

export const designerQuerySchema = z.object({
  id: z.string().trim().optional(),
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
})

export const materialQuerySchema = z.object({
  id: z.string().trim().optional(),
  category: z.string().trim().optional(),
})

export const budgetSuggestionSchema = z.object({
  budget: coercedNumber("Budget").positive("Budget must be greater than 0"),
  type: z.string().trim().default("residential").optional(),
  currency: z.enum(["USD", "INR"]).default("USD").optional(),
})

export const materialCreateSchema = z.object({
  name: nonEmptyString,
  category: nonEmptyString,
  description: nonEmptyString,
  costPerUnit: coercedNumber("Cost per unit").nonnegative("Cost per unit cannot be negative"),
  unit: nonEmptyString,
  currency: nonEmptyString,
  sustainability: coercedNumber("Sustainability").min(0).max(10),
  durability: coercedNumber("Durability").min(0).max(10),
  energyEfficiency: coercedNumber("Energy efficiency").min(0).max(10),
  locallyAvailable: z.boolean(),
})

export const materialUpdateSchema = materialCreateSchema.partial().extend({
  id: nonEmptyString,
})

export const designerLocationSchema = z.object({
  country: nonEmptyString,
  state: nonEmptyString,
  city: nonEmptyString,
})

export const designerCreateSchema = z.object({
  name: nonEmptyString,
  email: z.string().trim().email("Enter a valid email address"),
  phone: nonEmptyString,
  specialization: nonEmptyString,
  experience: coercedNumber("Experience").int().nonnegative(),
  location: designerLocationSchema,
  availability: z.boolean(),
  portfolio: z.union([z.string().trim(), z.array(z.string().trim())]).optional(),
  rating: coercedNumber("Rating").min(0).max(5).optional(),
})

export const designerUpdateSchema = z.object({
  id: nonEmptyString,
  name: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email address").optional(),
  phone: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  experience: coercedNumber("Experience").int().nonnegative().optional(),
  availability: z.boolean().optional(),
  portfolio: z.union([z.string().trim(), z.array(z.string().trim())]).optional(),
  rating: coercedNumber("Rating").min(0).max(5).optional(),
  location: designerLocationSchema.partial().optional(),
})
