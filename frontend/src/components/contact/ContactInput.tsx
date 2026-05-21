"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const fieldClass =
  "h-14 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-[#111827] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-brand/50 focus:ring-2 focus:ring-brand/20";

interface ContactInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  error?: string;
}

export const ContactInput = forwardRef<HTMLInputElement, ContactInputProps>(
  function ContactInput({ icon, error, className, ...props }, ref) {
    return (
      <div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand">
            {icon}
          </span>
          <input
            ref={ref}
            className={cn(fieldClass, error && "border-red-300", className)}
            {...props}
          />
        </div>
        {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);

interface ContactTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: ReactNode;
  error?: string;
}

export const ContactTextarea = forwardRef<HTMLTextAreaElement, ContactTextareaProps>(
  function ContactTextarea({ icon, error, className, ...props }, ref) {
    return (
      <div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-4 text-brand">
            {icon}
          </span>
          <textarea
            ref={ref}
            className={cn(
              "min-h-[140px] w-full resize-y rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#111827] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-brand/50 focus:ring-2 focus:ring-brand/20",
              error && "border-red-300",
              className
            )}
            {...props}
          />
        </div>
        {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);

interface ContactSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  icon: ReactNode;
  error?: string;
  options: readonly string[];
  placeholder?: string;
}

export const ContactSelect = forwardRef<HTMLSelectElement, ContactSelectProps>(
  function ContactSelect(
    { icon, error, options, placeholder = "Select a service", className, ...props },
    ref
  ) {
    return (
      <div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-brand">
            {icon}
          </span>
          <select
            ref={ref}
            className={cn(
              fieldClass,
              "appearance-none cursor-pointer",
              !props.value && "text-[#9CA3AF]",
              error && "border-red-300",
              className
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="text-[#111827]">
                {opt}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);
