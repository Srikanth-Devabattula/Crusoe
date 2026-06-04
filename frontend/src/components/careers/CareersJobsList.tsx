"use client";

import { useCallback, useEffect, useState } from "react";

import { JobCard } from "@/components/careers/JobCard";
import { getApiErrorMessage } from "@/lib/api-error";
import { jobService } from "@/services";
import type { Job } from "@/types";

export function CareersJobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await jobService.getPublished();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <section id="open-positions" className="bg-transparent py-14 sm:py-16 lg:py-20">
      <div className="hero-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Open positions
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Current opportunities
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Select a role to read the full description and submit your application.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-[20px] border border-gray-100 bg-gray-50"
                aria-hidden
              />
            ))}
          </div>
        ) : error ? (
          <p className="mt-12 rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
            {error}
          </p>
        ) : jobs.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-slate-600">
            No open positions right now. Check back soon or reach out through our
            contact page.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
