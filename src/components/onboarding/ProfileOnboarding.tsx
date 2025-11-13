"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { completeUserOnboarding } from "@/lib/db-actions";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
];

export function ProfileOnboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monthly_income: "",
    currency: "USD",
    salary_day: "",
    occupation: "",
    phone: "",
    date_of_birth: undefined as Date | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : undefined,
        currency: formData.currency,
        salary_day: formData.salary_day ? parseInt(formData.salary_day) : undefined,
        occupation: formData.occupation || undefined,
        phone: formData.phone || undefined,
        date_of_birth: formData.date_of_birth
          ? format(formData.date_of_birth, "yyyy-MM-dd")
          : undefined,
      };

      const { error } = await completeUserOnboarding(profileData);

      if (error) {
        console.error("Error completing onboarding:", error);
        alert("Failed to save profile. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.monthly_income) {
      alert("Please enter your monthly income to continue.");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const isStep1Valid = formData.monthly_income && formData.currency;
  const isStep2Valid = formData.salary_day;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to FinAI, {user?.firstName || "there"}! 👋
          </CardTitle>
          <CardDescription className="text-center text-slate-300 text-lg">
            Let&apos;s set up your financial profile to give you personalized insights
          </CardDescription>
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === step ? "w-8 bg-primary" : "w-2 bg-slate-600",
                )}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="monthly_income" className="text-slate-200">
                    Monthly Income *
                  </Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                    value={formData.monthly_income}
                    onChange={(e) =>
                      setFormData({ ...formData, monthly_income: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                  <p className="text-sm text-slate-400">
                    Your average monthly income helps us create accurate budgets
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-200">
                    Currency *
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CURRENCIES.map((currency) => (
                        <SelectItem
                          key={currency.value}
                          value={currency.value}
                          className="text-white hover:bg-slate-700"
                        >
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="salary_day" className="text-slate-200">
                    Salary Day (Day of Month) *
                  </Label>
                  <Input
                    id="salary_day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="15"
                    value={formData.salary_day}
                    onChange={(e) =>
                      setFormData({ ...formData, salary_day: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                  <p className="text-sm text-slate-400">
                    The day of the month you typically receive your salary
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-slate-200">
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Software Engineer"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep2Valid}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                          !formData.date_of_birth && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date_of_birth ? (
                          format(formData.date_of_birth, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                      <Calendar
                        mode="single"
                        selected={formData.date_of_birth}
                        onSelect={(date) =>
                          setFormData({ ...formData, date_of_birth: date })
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="bg-slate-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center">
              * Required fields. You can update these details later in Settings.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
