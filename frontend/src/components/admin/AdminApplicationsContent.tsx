"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download, Mail, Phone, Search, Trash2, User } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/cn";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatJobType } from "@/lib/jobLabels";
import { getResumeUrl } from "@/lib/uploads";
import { applicationService } from "@/services";
import type { JobApplication, JobWithApplications } from "@/types";

function formatAppliedDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function matchesSearch(application: JobApplication, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    application.name.toLowerCase().includes(q) ||
    application.email.toLowerCase().includes(q) ||
    (application.phone ?? "").toLowerCase().includes(q)
  );
}

export function AdminApplicationsContent() {
  const [groups, setGroups] = useState<JobWithApplications[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  const filteredApplications = useMemo(() => {
    if (!selected) return [];
    return selected.applications.filter((app) => matchesSearch(app, searchQuery));
  }, [selected, searchQuery]);

  const filteredIds = useMemo(
    () => filteredApplications.map((app) => app._id),
    [filteredApplications]
  );

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  const someFilteredSelected = filteredIds.some((id) => selectedIds.has(id));

  useEffect(() => {
    setSelectedIds(new Set());
    setSearchQuery("");
  }, [selectedJobId]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleDelete = async (ids: string[], label: string) => {
    if (ids.length === 0) return;
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      if (ids.length === 1) {
        await applicationService.delete(ids[0]);
      } else {
        await applicationService.deleteMany(ids);
      }
      toast.success(
        ids.length === 1 ? "Application deleted" : `${ids.length} applications deleted`
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      await loadApplications();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = () => {
    const ids = Array.from(selectedIds).filter((id) =>
      filteredIds.includes(id)
    );
    handleDelete(ids, `${ids.length} selected application(s)`);
  };

  const totalApplications = groups.reduce((n, g) => n + g.applications.length, 0);

  return (
    <>
      <AdminHeader title="Job applications" />

      <div className="grid max-h-[calc(100vh-10rem)] gap-6 overflow-hidden lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="shrink-0 text-lg font-semibold text-gray-900">
            Jobs with applications
          </h2>
          <p className="mt-1 shrink-0 text-sm text-gray-500">
            {groups.length} job{groups.length === 1 ? "" : "s"} · {totalApplications}{" "}
            total application{totalApplications === 1 ? "" : "s"}
          </p>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : groups.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No applications yet. Submissions from the careers page will appear here.
            </p>
          ) : (
            <ul className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
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

        <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <p className="p-6 text-sm text-gray-500">Loading applications...</p>
          ) : !selected ? (
            <p className="p-6 text-sm text-gray-500">
              Select a job on the left to view applicants.
            </p>
          ) : (
            <>
              <div className="shrink-0 border-b border-gray-100 px-6 pb-4 pt-6">
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

              <div className="shrink-0 space-y-3 border-b border-gray-100 px-6 py-4">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or phone..."
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                      }}
                      onChange={toggleSelectAllFiltered}
                      disabled={filteredApplications.length === 0 || isDeleting}
                      className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    Select all
                    {searchQuery.trim() && filteredApplications.length > 0 && (
                      <span className="text-gray-500">
                        ({filteredApplications.length} shown)
                      </span>
                    )}
                  </label>

                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={
                      isDeleting ||
                      !Array.from(selectedIds).some((id) => filteredIds.includes(id))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Delete selected
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  {filteredApplications.length} of {selected.applications.length}{" "}
                  applicant{selected.applications.length === 1 ? "" : "s"}
                  {searchQuery.trim() ? " matching search" : ""}
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                {filteredApplications.length === 0 ? (
                  <p className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                    {searchQuery.trim()
                      ? "No applicants match your search."
                      : "No applicants for this job."}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {filteredApplications.map((application) => (
                      <li
                        key={application._id}
                        className={cn(
                          "rounded-lg border p-4 transition",
                          selectedIds.has(application._id)
                            ? "border-brand/40 bg-brand/5"
                            : "border-gray-100 bg-gray-50/60"
                        )}
                      >
                        <div className="flex gap-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(application._id)}
                            onChange={() => toggleSelect(application._id)}
                            disabled={isDeleting}
                            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand focus:ring-brand"
                            aria-label={`Select ${application.name}`}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0 space-y-2">
                                <p className="flex items-center gap-2 font-semibold text-gray-900">
                                  <User
                                    className="h-4 w-4 shrink-0 text-gray-400"
                                    aria-hidden
                                  />
                                  {application.name}
                                </p>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail
                                    className="h-4 w-4 shrink-0 text-gray-400"
                                    aria-hidden
                                  />
                                  <a
                                    href={`mailto:${application.email}`}
                                    className="truncate hover:text-brand hover:underline"
                                  >
                                    {application.email}
                                  </a>
                                </p>
                                {application.phone ? (
                                  <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone
                                      className="h-4 w-4 shrink-0 text-gray-400"
                                      aria-hidden
                                    />
                                    <a
                                      href={`tel:${application.phone}`}
                                      className="hover:text-brand hover:underline"
                                    >
                                      {application.phone}
                                    </a>
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-400">
                                    No phone provided
                                  </p>
                                )}
                                <p className="text-xs text-gray-400">
                                  Applied {formatAppliedDate(application.createdAt)}
                                </p>
                              </div>

                              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <a
                                  href={getResumeUrl(application.resume)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-brand/40 hover:text-brand"
                                >
                                  <Download className="h-4 w-4" aria-hidden />
                                  CV
                                </a>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      [application._id],
                                      `application from ${application.name}`
                                    )
                                  }
                                  disabled={isDeleting}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                  aria-label={`Delete ${application.name}`}
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
