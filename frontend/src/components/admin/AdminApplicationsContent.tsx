"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download, Mail, Phone, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { getApiErrorMessage } from "@/lib/api-error";
import { matchesSearchQuery } from "@/lib/admin-search";
import { getResumeUrl } from "@/lib/uploads";
import { applicationService } from "@/services";
import type { ApplicationStatus, ApplicationType, JobApplication } from "@/types";

const STATUS_OPTIONS: ApplicationStatus[] = ["pending", "reviewed", "accepted", "rejected"];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-blue-100 text-blue-800",
  reviewed: "bg-amber-100 text-amber-800",
  accepted: "bg-brand-muted/60 text-green-800",
  rejected: "bg-gray-200 text-gray-600",
};

const linkClass = "text-brand hover:underline";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getApplicationType(application: JobApplication): ApplicationType {
  if (application.applicationType) return application.applicationType;
  return application.job ? "job" : "general";
}

function getJobTitle(application: JobApplication) {
  if (getApplicationType(application) === "general") {
    return "General application";
  }
  if (typeof application.job === "object" && application.job?.title) {
    return application.job.title;
  }
  return "Unknown position";
}

function getJobId(application: JobApplication): string | null {
  if (getApplicationType(application) === "general") return null;
  if (typeof application.job === "object" && application.job?._id) {
    return application.job._id;
  }
  if (typeof application.job === "string") return application.job;
  return null;
}

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function AdminApplicationsContent() {
  const [items, setItems] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState<"" | ApplicationType>("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadItems = useCallback(async () => {
    try {
      const res = await applicationService.getAll();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const jobOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) {
      const id = getJobId(item);
      if (id) map.set(id, getJobTitle(item));
    }
    return Array.from(map.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedType && getApplicationType(item) !== selectedType) return false;
      if (selectedJobId && getJobId(item) !== selectedJobId) return false;
      if (selectedStatus && item.status !== selectedStatus) return false;
      if (
        !matchesSearchQuery(searchQuery, [
          item.name,
          item.email,
          item.phone,
          item.message,
          getJobTitle(item),
          typeof item.job === "object" ? item.job?.location : undefined,
          typeof item.job === "object" ? item.job?.experience : undefined,
        ])
      ) {
        return false;
      }
      return true;
    });
  }, [items, selectedJobId, selectedStatus, selectedType, searchQuery]);

  const hasActiveFilter = Boolean(
    selectedJobId || selectedStatus || selectedType || searchQuery.trim()
  );

  const visibleIds = useMemo(() => filteredItems.map((item) => item._id), [filteredItems]);
  const {
    selectedCount,
    allSelected,
    someSelected,
    isSelected,
    toggleOne,
    toggleAll,
    clear,
    getSelectedIds,
  } = useBulkSelection(visibleIds);

  const handleStatusChange = async (item: JobApplication, status: ApplicationStatus) => {
    try {
      await applicationService.updateStatus(item._id, status);
      toast.success("Status updated");
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (item: JobApplication) => {
    if (!confirm(`Delete application from "${item.name}"?`)) return;
    try {
      await applicationService.delete(item._id);
      toast.success("Application deleted");
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDeleteSelected = async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;

    const label =
      ids.length === filteredItems.length
        ? `Delete all ${ids.length} visible application${ids.length === 1 ? "" : "s"}?`
        : `Delete ${ids.length} selected application${ids.length === 1 ? "" : "s"}?`;

    if (!confirm(label)) return;

    setIsDeleting(true);
    try {
      await applicationService.deleteMany(ids);
      toast.success(`${ids.length} application${ids.length === 1 ? "" : "s"} deleted`);
      clear();
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const pendingCount = filteredItems.filter((i) => i.status === "pending").length;

  return (
    <>
      <AdminHeader title="Applications" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Job & general applications</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredItems.length} application{filteredItems.length === 1 ? "" : "s"}
              {hasActiveFilter && items.length !== filteredItems.length && (
                <span className="text-gray-400"> of {items.length} total</span>
              )}
              {pendingCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  {pendingCount} pending
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <AdminSearchInput
              id="application-search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search name, email, phone, role…"
              className="w-full sm:w-auto sm:min-w-[280px]"
            />

            <div className="min-w-[200px]">
              <label htmlFor="application-type-filter" className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                Filter by type
              </label>
              <select
                id="application-type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "" | ApplicationType)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">All types</option>
                <option value="job">Job applications</option>
                <option value="general">General applications</option>
              </select>
            </div>

            <div className="min-w-[200px]">
              <label htmlFor="job-status-filter" className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                Filter by status
              </label>
              <select
                id="job-status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {jobOptions.length > 0 && (
              <div className="min-w-[200px]">
                <label htmlFor="job-role-filter" className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                  Filter by role
                </label>
                <select
                  id="job-role-filter"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">All roles</option>
                  {jobOptions.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            {hasActiveFilter
              ? "No applications match your search or filters."
              : "No applications yet."}
          </p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Select all{hasActiveFilter ? " (filtered)" : ""}
              </label>

              {selectedCount > 0 && (
                <>
                  <span className="text-sm text-gray-500">{selectedCount} selected</span>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : `Delete selected (${selectedCount})`}
                  </button>
                </>
              )}
            </div>

            <ul className="mt-4 space-y-3">
              {filteredItems.map((item) => {
                const jobTitle = getJobTitle(item);
                const resumeUrl = getResumeUrl(item.resume);
                const checked = isSelected(item._id);
                const tel = item.phone?.trim() ? phoneHref(item.phone) : "";

                return (
                  <li
                    key={item._id}
                    className={`rounded-lg border p-4 ${
                      checked ? "border-brand/40 bg-brand-muted/20" : "border-gray-100 bg-gray-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item._id)}
                        aria-label={`Select application from ${item.name}`}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLES[item.status]}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-800">{jobTitle}</p>

                        {item.message?.trim() && (
                          <p className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700">
                            {item.message}
                          </p>
                        )}

                        <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs text-gray-500">
                          <a
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(jobTitle)} application`}
                            className={linkClass}
                          >
                            {item.email}
                          </a>
                          {item.phone?.trim() && tel && (
                            <>
                              <span>·</span>
                              <a href={tel} className={linkClass}>
                                {item.phone}
                              </a>
                            </>
                          )}
                          <span>·</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </p>

                        {typeof item.job === "object" && item.job && (
                          <dl className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                            {item.job.location && (
                              <div>
                                <dt className="text-xs font-semibold uppercase text-gray-500">Location</dt>
                                <dd>{item.job.location}</dd>
                              </div>
                            )}
                            {item.job.experience && (
                              <div>
                                <dt className="text-xs font-semibold uppercase text-gray-500">Experience</dt>
                                <dd>{item.job.experience}</dd>
                              </div>
                            )}
                          </dl>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <label className="text-xs font-semibold uppercase text-gray-500">Status</label>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item, e.target.value as ApplicationStatus)
                            }
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4" />
                            Resume
                          </a>

                          <a
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(jobTitle)} application`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </a>

                          {tel && (
                            <a
                              href={tel}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Phone className="h-4 w-4" />
                              Call
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
