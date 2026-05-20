"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminJobForm } from "@/components/admin/AdminJobForm";
import { getApiErrorMessage } from "@/lib/api-error";
import { jobService } from "@/services";
import type { Job } from "@/types";

export function AdminJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      const res = await jobService.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setJobs(list);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleDelete = async (job: Job) => {
    if (!confirm(`Delete "${job.title}"?`)) return;

    try {
      await jobService.delete(job._id);
      toast.success("Job deleted");
      if (editingJob?._id === job._id) setEditingJob(null);
      loadJobs();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <>
      <AdminHeader title="Job postings" />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AdminJobForm
          editingJob={editingJob}
          onCancelEdit={() => setEditingJob(null)}
          onSuccess={() => {
            setEditingJob(null);
            loadJobs();
          }}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Posted jobs</h2>
          <p className="mt-1 text-sm text-gray-500">
            {jobs.length} listing{jobs.length === 1 ? "" : "s"}
          </p>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No jobs yet. Create your first posting using the form.
            </p>
          ) : (
            <ul className="mt-6 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {jobs.map((job) => (
                <li
                  key={job._id}
                  className="rounded-lg border border-gray-100 bg-gray-50/80 p-4 transition hover:border-gray-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {job.shortDescription || "No short description"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                        {job.experience && <span>{job.experience}</span>}
                        {job.experience && job.location && <span>·</span>}
                        {job.location && <span>{job.location}</span>}
                      </div>
                      <span
                        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          job.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {job.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingJob(job)}
                        className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-gray-900"
                        aria-label={`Edit ${job.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job)}
                        className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-red-600"
                        aria-label={`Delete ${job.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
