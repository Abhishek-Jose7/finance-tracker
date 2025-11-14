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
import { CalendarIcon, Loader2, ShoppingCart, Film, Home, UtensilsCrossed, Car, Shirt, HeartPulse, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { completeUserOnboarding } from "@/lib/db-actions";
import { createUserBudgets } from "@/lib/file-processing";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { value: "INR", label: "₹ (INR)" },
  { value: "USD", label: "$ (USD)" },
  { value: "EUR", label: "€ (EUR)" },
  { value: "GBP", label: "£ (GBP)" },
  { value: "JPY", label: "¥ (JPY)" },
  { value: "AUD", label: "A$ (AUD)" },
  { value: "CAD", label: "C$ (CAD)" },
];

const DEFAULT_BUDGET_CATEGORIES = [
  { name: "Groceries", default: 5000, icon: "ShoppingCart", color: "#10b981", Icon: ShoppingCart },
  { name: "Entertainment", default: 3000, icon: "Film", color: "#8b5cf6", Icon: Film },
  { name: "Rent", default: 15000, icon: "Home", color: "#f59e0b", Icon: Home },
  { name: "Dining", default: 4000, icon: "UtensilsCrossed", color: "#ef4444", Icon: UtensilsCrossed },
  { name: "Transportation", default: 2000, icon: "Car", color: "#3b82f6", Icon: Car },
  { name: "Shopping", default: 3000, icon: "Shirt", color: "#ec4899", Icon: Shirt },
  { name: "Healthcare", default: 2500, icon: "HeartPulse", color: "#14b8a6", Icon: HeartPulse },
  { name: "Education", default: 2000, icon: "BookOpen", color: "#f97316", Icon: BookOpen },
];

export function EnhancedProfileOnboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monthly_income: "",
    currency: "INR",
    salary_day: "",
    occupation: "",
    phone: "",
    date_of_birth: undefined as Date | undefined,
  });
  const [budgets, setBudgets] = useState<Record<string, number>>(
    DEFAULT_BUDGET_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat.name]: cat.default,
    }), {})
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save profile data
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

      const { error: profileError } = await completeUserOnboarding(profileData);

      if (profileError) {
        console.error("Error completing onboarding:", profileError);
        alert("Failed to save profile. Please try again.");
        return;
      }

      // Save budget categories
      const budgetData = DEFAULT_BUDGET_CATEGORIES.map(cat => ({
        name: cat.name,
        budget_limit: budgets[cat.name] || cat.default,
        color: cat.color,
        icon: cat.icon,
      }));

      const { error: budgetError } = await createUserBudgets(budgetData);

      if (budgetError) {
        console.error("Error creating budgets:", budgetError);
        alert("Failed to save budgets. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
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
    if (step === 2 && !formData.salary_day) {
      alert("Please enter your salary day to continue.");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const monthlyIncome = parseFloat(formData.monthly_income) || 0;
  const budgetPercentage = monthlyIncome > 0 ? (totalBudget / monthlyIncome) * 100 : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-3xl bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to FinAI, {user?.firstName || "there"}! 👋
          </CardTitle>
          <CardDescription className="text-center text-slate-300 text-lg">
            Let&apos;s set up your financial profile and budgets
          </CardDescription>
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
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
            {/* Step 1: Income & Currency */}
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
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Continue to Salary Details
                </Button>
              </div>
            )}

            {/* Step 2: Salary Day & Occupation */}
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
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Continue to Budget Setup
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Budget Setup */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200 text-lg font-semibold">
                      Set Your Monthly Budgets
                    </Label>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Total Budget</div>
                      <div className="text-xl font-bold text-primary">
                        {formData.currency} {totalBudget.toFixed(0)}
                      </div>
                      {monthlyIncome > 0 && (
                        <div className={cn(
                          "text-xs",
                          budgetPercentage > 100 ? "text-red-400" : "text-green-400"
                        )}>
                          {budgetPercentage.toFixed(0)}% of income
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {DEFAULT_BUDGET_CATEGORIES.map((category) => {
                      const IconComponent = category.Icon;
                      return (
                        <div
                          key={category.name}
                          className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                        >
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: category.color + "20" }}
                          >
                            <IconComponent
                              className="h-5 w-5"
                              style={{ color: category.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-slate-200 text-sm">
                              {category.name}
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="10"
                              value={budgets[category.name]}
                              onChange={(e) =>
                                setBudgets({
                                  ...budgets,
                                  [category.name]: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="mt-1 bg-slate-700 border-slate-600 text-white h-8 text-sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Continue to Personal Info
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Personal Info (Optional) */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200">
                    Phone Number (Optional)
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
                  <Label className="text-slate-200">Date of Birth (Optional)</Label>
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
                        Setting up...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center">
              * Required fields. You can update these anytime in Settings.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
