import Link from "next/link";
import { ROUTES } from "@/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>
      <Link
        href={ROUTES.home}
        className="mt-6 text-sm font-medium text-gray-900 underline hover:no-underline"
      >
        Return home
      </Link>
    </div>
  );
}
