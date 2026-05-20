"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { ROUTES } from "@/constants";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatJobType } from "@/lib/jobLabels";
import { jobService } from "@/services";
import type { Job } from "@/types";

interface JobDetailViewProps {
  jobId: string;
}

export function JobDetailView({ jobId }: JobDetailViewProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await jobService.getById(jobId);
      setJob(res.data ?? null);
      if (!res.data) setError("Job not found");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  if (isLoading) {
    return (
      <div className="hero-container py-10 sm:py-14">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-10 w-2/3 max-w-lg rounded bg-gray-100" />
          <div className="h-24 rounded-xl bg-gray-50" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="hero-container py-10 sm:py-14">
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error ?? "This position could not be found."}
        </p>
        <Link
          href={ROUTES.careers}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to careers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-10 sm:py-14 lg:py-16">
      <div className="hero-container">
        <Link
          href={ROUTES.careers}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          All open positions
        </Link>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start lg:gap-12 xl:gap-16">
          <article>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {formatJobType(job.type)}
              </span>
              {job.department && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {job.department}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              {job.title}
            </h1>

            <ul className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <HiOutlineBriefcase className="h-4 w-4 text-brand" aria-hidden />
                {job.experience}
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineLocationMarker className="h-4 w-4 text-brand" aria-hidden />
                {job.location}
              </li>
            </ul>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              {job.shortDescription}
            </p>

            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">About this role</h2>
              <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-600">
                {job.longDescription}
              </div>
            </div>
          </article>

          <aside className="mt-10 lg:sticky lg:top-28 lg:mt-0">
            <JobApplicationForm jobId={job._id} jobTitle={job.title} />
          </aside>
        </div>
      </div>
    </div>
  );
}
