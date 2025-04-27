import { z } from "zod";

export const addressFormSchema = z.object({
  street_address: z.string({
    required_error: "Street address is required",
  }),
  area: z.string({
    required_error: "Area/neighborhood is required",
  }),
  city: z.string({
    required_error: "City is required",
  }),
  region: z.string({
    required_error: "Region/state is required",
  }),
  postal_code: z.string().optional(),
  country: z.string({
    required_error: "Country is required",
  }).default("Guyana"),
});

export type AddressFormValues = {
  street_address: string;
  area: string;
  city: string;
  region: string;
  country: string;
  postal_code?: string;
};
