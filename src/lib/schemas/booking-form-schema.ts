import { z } from "zod";

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
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
