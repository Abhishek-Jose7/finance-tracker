import { redirect } from "next/navigation";

export default function MainPage() {
  // This will redirect to the dashboard layout
  redirect("/dashboard");
}
