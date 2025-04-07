"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  CircleSmall,
  Loader2,
} from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-number-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useOtpVerification } from "@/lib/otp-verify";

const formSchema = z.object({
  service: z.enum([
    "PHYSICAL CONSULTATION",
    "ONLINE CONSULTATION",
    "SECONDARY",
  ]),
  doctor: z.enum(["Dr. Arijit Chakraborty", "ANY"]),
  date: z.date(),
  time: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  problem: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPending = isSubmitting ? true : false;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "PHYSICAL CONSULTATION",
      doctor: "Dr. Arijit Chakraborty",
      date: new Date(),
      time: "05:00 PM",
      name: "",
      phone: "",
      email: "",
      problem: "",
    },
  });

  const steps = [
    { id: 1, name: "Branch Details" },
    { id: 2, name: "Admin Details" },
    { id: 3, name: "Account Setup" },
  ];

  const nextStep = async () => {
    let validationSuccess = false;
    if (currentStep === 1) {
      validationSuccess = await form.trigger(["service", "doctor"]);
    } else if (currentStep === 2) {
      validationSuccess = await form.trigger(["date", "time"]);
    }
    if (validationSuccess) {
      setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const {
    otpSent,
    verifying,
    verified,
    enteredOtp,
    setEnteredOtp,
    sendOTP,
    verifyOTP,
    resetVerification,
  } = useOtpVerification({
    apiKey: process.env.NEXT_PUBLIC_APY_KEY || "",
    senderId: process.env.NEXT_PUBLIC_SENDER_ID || "",
    templateId: process.env.NEXT_PUBLIC_TEMPLATE_ID || "",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
  };

  return (
    <Card className="w-full h-full p-5 border-none shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel className="text-lg font-semibold text-primary">
                      Service
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PHYSICAL CONSULTATION">
                          Physical Consultation
                        </SelectItem>
                        <SelectItem value="ONLINE CONSULTATION">
                          Online Consultation
                        </SelectItem>
                        <SelectItem value="SECONDARY">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel className="text-lg font-semibold text-primary">
                      Doctor
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Dr. Arijit Chakraborty">
                          Dr. Arijit Chakraborty
                        </SelectItem>
                        <SelectItem value="ANY">Any Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="w-full flex items-center justify-center">
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full mb-6">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border h-fit"
                    />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-1">
                <div className="px-4 py-1 rounded-sm bg-primary text-white font-semibold">
                  <span className="text-sm">
                    {format(form.watch("date"), "dd/MM/yyyy")}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="w-full mb-4">
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 gap-1"
                      >
                        {[
                          "5:00 pm",
                          "5:15 pm",
                          "5:30 pm",
                          "5:45 pm",
                          "6:00 pm",
                          "6:15 pm",
                          "6:30 pm",
                          "6:45 pm",
                          "7:00 pm",
                          "7:15 pm",
                          "7:30 pm",
                          "7:45 pm",
                        ].map((time) => (
                          <div key={time} className="relative">
                            <RadioGroupItem
                              value={time}
                              id={`time-${time}`}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={`time-${time}`}
                              className="flex h-8 w-full px-3 py-1 items-center rounded-sm border border-gray-200 text-center peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary hover:border-gray-300 cursor-pointer text-sm"
                            >
                              {field.value === time ? (
                                <CircleDot className="h-4 w-4 mr-1 text-primary" />
                              ) : (
                                <CircleSmall className="h-5 w-5 mr-1 text-gray-300" />
                              )}
                              {time}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full mb-4">
                      <FormLabel className="text-lg font-semibold text-primary">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="Enter Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full mb-4">
                      <FormLabel className="text-lg font-semibold text-primary">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="Enter Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full mb-2">
                        <FormLabel className="text-lg font-semibold text-primary">
                          Phone Number
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <PhoneInput
                              placeholder="Enter mobile number"
                              {...field}
                              defaultCountry="IN"
                              disabled={otpSent}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            size="sm"
                            className="h-10"
                            disabled={!field.value || otpSent || verified}
                            onClick={() => sendOTP(field.value)}
                          >
                            Send OTP
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {otpSent && !verified && (
                    <div className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        maxLength={6}
                        className="w-40"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-10"
                        onClick={async () => {
                          const isValid = await verifyOTP();
                          if (!isValid) {
                            alert("Invalid or expired OTP. Please try again.");
                          }
                        }}
                        disabled={enteredOtp.length !== 6 || verifying}
                      >
                        {verifying ? (
                          <>
                            Verifying
                            <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={resetVerification}
                      >
                        Change Number
                      </Button>
                    </div>
                  )}

                  {verified && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span>Phone number verified successfully</span>
                    </div>
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel className="text-lg font-semibold text-primary">
                      Problem
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[120px] resize-none"
                        placeholder="Describe your problem"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size={"sm"} type="button">
                Verify OTP
              </Button>
            </div>
          )}
          <div
            className={cn(
              "mt-6 flex justify-between",
              currentStep === 1 && "justify-end"
            )}
          >
            {currentStep > 1 && (
              <Button
                size={"sm"}
                type="button"
                variant="outline"
                onClick={prevStep}
                className="active:scale-95 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button
                size={"sm"}
                type="button"
                className="flex items-center gap-1 active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size={"sm"}
                type="submit"
                className="flex items-center gap-1 active:scale-95"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Creating
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Create
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default BookingForm;
