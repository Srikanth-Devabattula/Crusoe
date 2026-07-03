"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { getApiErrorMessage } from "@/lib/api-error";
import { matchesSearchQuery } from "@/lib/admin-search";
import { contactService } from "@/services";
import type { ContactStatus, ContactSubmission } from "@/types";

const STATUS_OPTIONS: ContactStatus[] = ["new", "read", "replied"];

const STATUS_STYLES: Record<ContactStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-amber-100 text-amber-800",
  replied: "bg-brand-muted/60 text-green-800",
};

const linkClass = "text-brand hover:underline";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function AdminContactsContent() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedStatus && item.status !== selectedStatus) return false;
      if (
        !matchesSearchQuery(searchQuery, [
          item.name,
          item.email,
          item.phone,
          item.company,
          item.service,
          item.subject,
          item.message,
        ])
      ) {
        return false;
      }
      return true;
    });
  }, [items, selectedStatus, searchQuery]);

  const hasActiveFilter = Boolean(selectedStatus || searchQuery.trim());

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

  const loadItems = useCallback(async () => {
    try {
      const res = await contactService.getAll();
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

  const handleStatusChange = async (item: ContactSubmission, status: ContactStatus) => {
    try {
      await contactService.updateStatus(item._id, status);
      toast.success("Status updated");
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (item: ContactSubmission) => {
    if (!confirm(`Delete enquiry from "${item.name}"?`)) return;
    try {
      await contactService.delete(item._id);
      toast.success("Enquiry deleted");
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDeleteSelected = async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;

    const label =
      ids.length === filteredItems.length && !hasActiveFilter
        ? `Delete all ${ids.length} enquiries?`
        : `Delete ${ids.length} selected enquiry${ids.length === 1 ? "" : "ies"}?`;

    if (!confirm(label)) return;

    setIsDeleting(true);
    try {
      await contactService.deleteMany(ids);
      toast.success(`${ids.length} enquiry${ids.length === 1 ? "" : "ies"} deleted`);
      clear();
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const newCount = filteredItems.filter((i) => i.status === "new").length;

  return (
    <>
      <AdminHeader title="Contact form submissions" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Enquiries</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredItems.length} submission{filteredItems.length === 1 ? "" : "s"}
              {hasActiveFilter && items.length !== filteredItems.length && (
                <span className="text-gray-400"> of {items.length} total</span>
              )}
              {newCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  {newCount} new
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <AdminSearchInput
              id="contact-search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search name, email, phone, company…"
              className="w-full sm:w-auto sm:min-w-[280px]"
            />

            <div className="min-w-[200px]">
              <label htmlFor="contact-status-filter" className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                Filter by status
              </label>
              <select
                id="contact-status-filter"
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
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            {hasActiveFilter
              ? "No enquiries match your search or filters."
              : "No contact form submissions yet."}
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
                        aria-label={`Select enquiry from ${item.name}`}
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

                        <p className="mt-1 text-sm font-medium text-gray-800">{item.subject}</p>

                        <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs text-gray-500">
                          <a
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
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

                        <dl className="mt-3 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                          {item.company && (
                            <div>
                              <dt className="text-xs font-semibold uppercase text-gray-500">Company</dt>
                              <dd>{item.company}</dd>
                            </div>
                          )}
                          {item.service && (
                            <div>
                              <dt className="text-xs font-semibold uppercase text-gray-500">Service</dt>
                              <dd>{item.service}</dd>
                            </div>
                          )}
                        </dl>

                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase text-gray-500">Message</p>
                          <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-gray-800">
                            {item.message}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <label className="text-xs font-semibold uppercase text-gray-500">Status</label>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item, e.target.value as ContactStatus)
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
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Mail className="h-4 w-4" />
                            Reply
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
