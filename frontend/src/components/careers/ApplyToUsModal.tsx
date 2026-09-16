"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";

import { GeneralApplicationForm } from "@/components/careers/GeneralApplicationForm";

interface ApplyToUsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ApplyToUsModal({ open, onClose }: ApplyToUsModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-to-us-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[#e7efe0] bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.18)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-brand/30 hover:text-brand"
        >
          <FiX className="h-5 w-5" />
        </button>

        <h2 id="apply-to-us-title" className="pr-10 text-xl font-bold text-slate-900 sm:text-2xl">
          Apply to us
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Share your details and tell us about yourself. Accepted resume formats: PDF, DOC, DOCX
          (max 5MB).
        </p>

        <div className="mt-6">
          <GeneralApplicationForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
