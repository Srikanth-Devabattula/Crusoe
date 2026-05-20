"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Mail, Phone, User } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/cn";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatJobType } from "@/lib/jobLabels";
import { getResumeUrl } from "@/lib/uploads";
import { applicationService } from "@/services";
import type { JobWithApplications } from "@/types";

function formatAppliedDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminApplicationsContent() {
  const [groups, setGroups] = useState<JobWithApplications[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await applicationService.getAdminGrouped();
      const list = Array.isArray(res.data) ? res.data : [];
      setGroups(list);
      setSelectedJobId((prev) => {
        if (prev && list.some((g) => g.job._id === prev)) return prev;
        return list[0]?.job._id ?? null;
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setGroups([]);
      setSelectedJobId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const selected = groups.find((g) => g.job._id === selectedJobId) ?? null;

  return (
    <>
      <AdminHeader title="Job applications" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Jobs with applications</h2>
          <p className="mt-1 text-sm text-gray-500">
            {groups.length} job{groups.length === 1 ? "" : "s"} ·{" "}
            {groups.reduce((n, g) => n + g.applications.length, 0)} total application
            {groups.reduce((n, g) => n + g.applications.length, 0) === 1 ? "" : "s"}
          </p>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : groups.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No applications yet. Submissions from the careers page will appear here.
            </p>
          ) : (
            <ul className="mt-5 max-h-[640px] space-y-2 overflow-y-auto pr-1">
              {groups.map(({ job, applications }) => (
                <li key={job._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedJobId(job._id)}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left transition",
                      selectedJobId === job._id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-100 bg-gray-50/80 hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold leading-snug">{job.title}</p>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                          selectedJobId === job._id
                            ? "bg-white/20 text-white"
                            : "bg-brand/15 text-brand"
                        )}
                      >
                        {applications.length}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        selectedJobId === job._id ? "text-gray-300" : "text-gray-500"
                      )}
                    >
                      {job.experience}
                      {job.experience && job.location ? " · " : ""}
                      {job.location}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[320px]">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading applications...</p>
          ) : !selected ? (
            <p className="text-sm text-gray-500">
              Select a job on the left to view applicants.
            </p>
          ) : (
            <>
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">{selected.job.title}</h2>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <li>
                    <span className="font-medium text-gray-800">Experience:</span>{" "}
                    {selected.job.experience}
                  </li>
                  <li>
                    <span className="font-medium text-gray-800">Location:</span>{" "}
                    {selected.job.location}
                  </li>
                  {selected.job.department && (
                    <li>
                      <span className="font-medium text-gray-800">Department:</span>{" "}
                      {selected.job.department}
                    </li>
                  )}
                  <li>
                    <span className="font-medium text-gray-800">Type:</span>{" "}
                    {formatJobType(selected.job.type)}
                  </li>
                </ul>
              </div>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Applicants ({selected.applications.length})
              </h3>

              <ul className="mt-4 space-y-4">
                {selected.applications.map((application) => (
                  <li
                    key={application._id}
                    className="rounded-lg border border-gray-100 bg-gray-50/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-2">
                        <p className="flex items-center gap-2 font-semibold text-gray-900">
                          <User className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                          {application.name}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                          <a
                            href={`mailto:${application.email}`}
                            className="hover:text-brand hover:underline"
                          >
                            {application.email}
                          </a>
                        </p>
                        {application.phone ? (
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                            <a
                              href={`tel:${application.phone}`}
                              className="hover:text-brand hover:underline"
                            >
                              {application.phone}
                            </a>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400">No phone provided</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Applied {formatAppliedDate(application.createdAt)}
                        </p>
                      </div>

                      <a
                        href={getResumeUrl(application.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-brand/40 hover:text-brand"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Download CV
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}
