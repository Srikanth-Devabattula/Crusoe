import { cn } from "@/lib/cn";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Section({ children, title, className }: SectionProps) {
  return (
    <section className={cn("mb-12", className)}>
      {title && (
        <h2 className="mb-6 text-xl font-medium text-gray-900">{title}</h2>
      )}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
        {children}
      </div>
    </section>
  );
}
