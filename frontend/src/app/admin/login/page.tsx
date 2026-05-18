import { FormPlaceholder } from "@/components/forms/FormPlaceholder";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Admin Login",
  "Sign in to the admin dashboard."
);

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access the dashboard.
        </p>
        <div className="mt-8">
          <FormPlaceholder name="Admin Login" />
        </div>
      </div>
    </div>
  );
}
