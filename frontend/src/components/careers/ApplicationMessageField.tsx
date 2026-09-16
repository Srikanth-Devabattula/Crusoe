"use client";

import {
  APPLICATION_MESSAGE_MAX_WORDS,
  APPLICATION_MESSAGE_MIN_WORDS,
  countWords,
} from "@/lib/wordCount";

const textareaClass =
  "w-full rounded-xl border border-[#E8EEF5] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface ApplicationMessageFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ApplicationMessageField({
  id,
  value,
  onChange,
  label = "Tell us about yourself",
}: ApplicationMessageFieldProps) {
  const wordCount = countWords(value);
  const isOverLimit = wordCount > APPLICATION_MESSAGE_MAX_WORDS;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <textarea
        id={id}
        required
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={textareaClass}
        placeholder={`Write ${APPLICATION_MESSAGE_MIN_WORDS}–${APPLICATION_MESSAGE_MAX_WORDS} words about your experience and why you want to join us.`}
      />
      <p
        className={`mt-1.5 text-xs ${
          isOverLimit ? "font-medium text-red-600" : "text-slate-500"
        }`}
      >
        {wordCount} / {APPLICATION_MESSAGE_MAX_WORDS} words (minimum{" "}
        {APPLICATION_MESSAGE_MIN_WORDS})
      </p>
    </div>
  );
}

export const applicationInputClass =
  "w-full rounded-xl border border-[#E8EEF5] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export const APPLICATION_PHONE_PLACEHOLDER = "+91 XXXXX XXXXX";
