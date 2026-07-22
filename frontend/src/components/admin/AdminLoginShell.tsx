"use client";

import Link from "next/link";
import Image from "next/image";
import { ROUTES, SITE_LOGO_SRC } from "@/constants";

interface AdminLoginShellProps {
  title: string;
  description: string;
  alternateHref: string;
  alternateLabel: string;
  statusMessage?: string | null;
  children: React.ReactNode;
}

export function AdminLoginShell({
  title,
  description,
  alternateHref,
  alternateLabel,
  statusMessage,
  children,
}: AdminLoginShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f9fc] p-6 sm:p-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-8 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:p-10">
        <Link href={ROUTES.home} className="mb-8 flex justify-center">
          <Image
            src={SITE_LOGO_SRC}
            alt="Crusoe Tech"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </Link>

        <h1 className="text-center text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-600">{description}</p>

        {statusMessage ? (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-800">
            {statusMessage}
          </p>
        ) : null}

        <div className="mt-8">{children}</div>

        <p className="mt-8 text-center text-sm text-gray-600">
          {alternateLabel}{" "}
          <Link href={alternateHref} className="font-semibold text-brand hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
