import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function AdminDashboardPage() {
  redirect(ROUTES.admin.blogs);
}
