"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { bookingFormSchema } from "@/lib/schemas/booking-form-schema";
import type { BookingFormValues } from "@/lib/schemas/booking-form-schema";
import { dollarsToCents } from "@/lib/stripe";

import CheckoutButton from "@/components/payments/checkout-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  includes_media: boolean;
  is_active: boolean;
}

interface Address {
  id: string;
  clerk_user_id: string;
  street_address: string;
  area: string;
  city: string;
  region: string;
  postal_code?: string;
  country: string;
}

export default function BookingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  
  // For pre-selection from URL
  const [serviceIdFromUrl, setServiceIdFromUrl] = useState<string | null>(null);
  
  // Form with react-hook-form and zod validation
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: "",
      addressId: "",
      date: "",
      timeSlot: "",
      notes: "",
    },
  });

  // Get the selected service and address for display purposes
  const selectedService = services.find(service => service.id === form.watch("serviceId"));
  const selectedAddress = addresses.find(address => address.id === form.watch("addressId"));

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      
      // Check for serviceId in URL
      const searchParams = new URLSearchParams(window.location.search);
      const serviceIdParam = searchParams.get("serviceId");
      if (serviceIdParam) {
        setServiceIdFromUrl(serviceIdParam);
        form.setValue("serviceId", serviceIdParam);
      }

      // Fetch Services
      try {
        const servicesResponse = await fetch("/api/services");
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          if (servicesData.success) {
            setServices(servicesData.services || []);
          } else {
            setServicesError("Failed to load available services.");
          }
        } else {
          setServicesError("Failed to load available services.");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServicesError("Failed to load available services.");
      }
      setLoadingServices(false);

      // Fetch Addresses
      try {
        const addressesResponse = await fetch("/api/addresses");
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json();
          if (addressesData.success) {
            setAddresses(addressesData.addresses || []);
          } else {
            setAddressesError("Failed to load addresses.");
          }
        } else {
          setAddressesError("Failed to load addresses.");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddressesError("Failed to load addresses.");
      }
      setLoadingAddresses(false);
    }

    if (isLoaded && user) {
      fetchData();
    } else if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router, form]);

  // Form submission handler
  const onSubmit = (data: BookingFormValues) => {
    // We're using CheckoutButton which handles the API call
    // This function is just here to fulfill the React Hook Form API
    console.log("Form submitted", data);
  };

  // Redirect unauthenticated users to sign-in
  if (isLoaded && !user) {
    router.push("/sign-in");
    return null; // Or a loading spinner
  }

  if (loadingServices || loadingAddresses) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <p>Loading booking options...</p>
        </div>
      </div>
    );
  }

  if (servicesError || addressesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-red-600">
        <p>{servicesError || addressesError}</p>
      </div>
    );
  }

  // Get the price for the selected service (in dollars)
  const servicePriceDollars = selectedService ? (selectedService.price || 0) : 0;
  
  // Convert dollars to cents for Stripe
  const servicePriceCents = dollarsToCents(servicePriceDollars);
  
  // Check if the form is valid to show the booking summary
  const isFormValid = form.formState.isValid && 
    form.watch("serviceId") && 
    form.watch("addressId") && 
    form.watch("date") && 
    form.watch("timeSlot");


  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Book Your Service</h1>
      <div className="w-full max-w-md border p-8 rounded-lg shadow-md bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Select Service</FormLabel>
                  <Select
                    disabled={!!serviceIdFromUrl}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={serviceIdFromUrl ? "bg-gray-100" : ""}>
                        <SelectValue placeholder="-- Select a Service --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price ? service.price.toFixed(2) : 'Price TBD'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {serviceIdFromUrl && (
                    <FormDescription>
                      Pre-selected from previous page
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="font-bold">Select Address</FormLabel>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      type="button"
                      onClick={() => {
                        // Open address modal/dialog or redirect to address page
                        window.location.href = "/dashboard/addresses";
                      }}
                    >
                      <Plus className="h-4 w-4" /> 
                      Add New Address
                    </Button>
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select an Address --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.street_address}, {address.area}, {address.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {addresses.length === 0 && (
                    <FormDescription>
                      No addresses found. Use the "Add New Address" button above to add your service location.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Preferred Date</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      min={new Date().toISOString().split("T")[0]} // Today
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Preferred Time Slot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select a Time --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Booking Summary - only show when form is valid */}
            {isFormValid && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-lg mb-2">Booking Summary</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Service:</dt>
                    <dd className="font-medium">{selectedService?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Address:</dt>
                    <dd className="font-medium">
                      {selectedAddress?.street_address}, {selectedAddress?.city}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Date:</dt>
                    <dd className="font-medium">
                      {new Date(form.watch("date")).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Time:</dt>
                    <dd className="font-medium">
                      {form.watch("timeSlot") === "morning"
                        ? "Morning (8 AM - 12 PM)"
                        : "Afternoon (1 PM - 5 PM)"}
                    </dd>
                  </div>
                  <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200">
                    <dt>Total:</dt>
                    <dd className="text-green-700">${servicePriceDollars ? servicePriceDollars.toFixed(2) : 'Price TBD'}</dd>
                  </div>
                </dl>
                {selectedService && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium">Includes:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {selectedService.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Checkout Button */}
            {isLoaded && user && (
              <div className="mt-6">
                <CheckoutButton
                  serviceId={form.watch("serviceId")}
                  addressId={form.watch("addressId")}
                  date={form.watch("date")}
                  time={form.watch("timeSlot")}
                  price={servicePriceCents}
                  disabled={!isFormValid}
                />
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
