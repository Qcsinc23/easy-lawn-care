import { z } from "zod";

export const assessmentSchema = z.object({
  lawnSize: z.enum(["small", "medium", "large", "extra-large"], {
    required_error: "Please select your lawn size",
  }),
  lawnCondition: z.enum(["good", "fair", "poor"], {
    required_error: "Please select your lawn condition",
  }),
  hasObstacles: z.boolean().default(false),
  obstacleDetails: z.string().optional(),
  hasSpecialRequests: z.boolean().default(false),
  specialRequestDetails: z.string().optional(),
  hasExistingIrrigationSystem: z.boolean().default(false),
});

export const bookingFormSchema = z.object({
  serviceId: z.string({
    required_error: "Please select a service",
  }),
  addressId: z.string({
    required_error: "Please select an address",
  }),
  date: z.string({
    required_error: "Please select a date",
  }).refine((date) => {
    // Make sure date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: "Date cannot be in the past",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  notes: z.string().optional(),
  // Optional assessment fields that become required when custom service is selected
  assessment: assessmentSchema.optional(),
});

export type AssessmentValues = z.infer<typeof assessmentSchema>;
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
