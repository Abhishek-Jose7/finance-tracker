
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Palette,
  Globe,
  Bot,
  Bell,
  Database,
  Lock,
  HelpCircle,
} from "lucide-react";
import { BudgetManagement } from "@/components/settings/BudgetManagement";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Budget Management Section */}
      <BudgetManagement />

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User /> Account
          </CardTitle>
          <CardDescription>
            Manage your personal information and app preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["personal-info"]}>
            <AccordionItem value="personal-info">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Abhishek" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="abhishek@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+91" />
                </div>
                <Button>Update Profile</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="appearance">
              <AccordionTrigger>Appearance</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="localization">
              <AccordionTrigger>Localization</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">₹ (INR)</SelectItem>
                      <SelectItem value="usd">$ (USD)</SelectItem>
                      <SelectItem value="eur">€ (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* AI Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot /> AI Settings
          </CardTitle>
          <CardDescription>
            Customize the behavior of your AI financial assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-intensity">AI Intensity</Label>
            <Select defaultValue="normal">
              <SelectTrigger id="ai-intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="deep">Deep Insights</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="predict-overspending">Predict Overspending</Label>
            <Switch id="predict-overspending" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-budget">Auto-budget</Label>
            <Switch id="auto-budget" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell /> Notifications
          </CardTitle>
          <CardDescription>Manage how and when you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <Label htmlFor="daily-summary">Daily Summary</Label>
            <Switch id="daily-summary" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="unusual-spending">Unusual Spending Alerts</Label>
            <Switch id="unusual-spending" defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Silent Hours</Label>
            <div className="flex items-center gap-2">
              <Input type="time" defaultValue="22:00" />
              <span>to</span>
              <Input type="time" defaultValue="08:00" />
            </div>
             <p className="text-sm text-muted-foreground">
                Mute notifications during this period.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database /> Data Sources
          </CardTitle>
          <CardDescription>
            Control how your financial data is imported.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-parsing">SMS Parsing</Label>
            <Switch id="sms-parsing" defaultChecked />
          </div>
           <p className="text-sm text-muted-foreground -mt-2">
              Automatically create transactions by reading SMS messages from banks.
            </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Re-scan SMS</Button>
            <Button variant="outline">Upload Bank Statements</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock /> Security
          </CardTitle>
          <CardDescription>
            Manage your app&apos;s security and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="app-lock">App Lock</Label>
            <Switch id="app-lock" />
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
              Require authentication to open the app.
          </p>
          <div>
            <Button variant="destructive">Delete Account & Data</Button>
             <p className="text-sm text-muted-foreground mt-2">
                This action is permanent and cannot be undone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle /> Support
          </CardTitle>
          <CardDescription>Get help and find answers.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline">Contact Support</Button>
          <Button variant="outline">FAQs</Button>
        </CardContent>
      </Card>

      {/* Database Test Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database /> Database Connection
          </CardTitle>
          <CardDescription>Test your Supabase database connection</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.href = '/settings/test-db'}>
            <Database className="mr-2 h-4 w-4" />
            Test Database Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    