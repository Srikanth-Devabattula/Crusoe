"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  Mail,
  Phone,
  Search,
  Trash2,
  User,
} from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/cn";
import { getApiErrorMessage } from "@/lib/api-error";
import { contactService } from "@/services";
import type { ContactStatus, ContactSubmission } from "@/types";

const STATUS_FILTERS: Array<ContactStatus | "all"> = [
  "all",
  "new",
  "read",
  "replied",
];

const statusLabel: Record<ContactStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
};

const statusBadgeClass: Record<ContactStatus, string> = {
  new: "bg-brand/15 text-brand",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-blue-50 text-blue-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function matchesSearch(contact: ContactSubmission, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    contact.name.toLowerCase().includes(q) ||
    contact.email.toLowerCase().includes(q) ||
    (contact.phone ?? "").toLowerCase().includes(q) ||
    (contact.company ?? "").toLowerCase().includes(q) ||
    (contact.service ?? "").toLowerCase().includes(q) ||
    contact.subject.toLowerCase().includes(q) ||
    contact.message.toLowerCase().includes(q)
  );
}

export function AdminContactsContent() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getAdminList();
      const list = Array.isArray(res.data) ? res.data : [];
      setContacts(list);
      setSelectedId((prev) => {
        if (prev && list.some((c) => c._id === prev)) return prev;
        return list[0]?._id ?? null;
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setContacts([]);
      setSelectedId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (statusFilter !== "all" && contact.status !== statusFilter) return false;
      return matchesSearch(contact, searchQuery);
    });
  }, [contacts, statusFilter, searchQuery]);

  const filteredIds = useMemo(
    () => filteredContacts.map((c) => c._id),
    [filteredContacts]
  );

  const selected =
    contacts.find((c) => c._id === selectedId) ??
    filteredContacts.find((c) => c._id === selectedId) ??
    null;

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  const someFilteredSelected = filteredIds.some((id) => selectedIds.has(id));

  const newCount = contacts.filter((c) => c.status === "new").length;

  useEffect(() => {
    setSelectedIds(new Set());
  }, [statusFilter]);

  const selectContact = async (id: string) => {
    setSelectedId(id);
    const contact = contacts.find((c) => c._id === id);
    if (contact?.status === "new") {
      try {
        await contactService.updateStatus(id, "read");
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: "read" } : c))
        );
      } catch {
        // Non-blocking; detail still visible
      }
    }
  };

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
        await contactService.delete(ids[0]);
      } else {
        await contactService.deleteMany(ids);
      }
      toast.success(
        ids.length === 1 ? "Enquiry deleted" : `${ids.length} enquiries deleted`
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      if (selectedId && ids.includes(selectedId)) {
        setSelectedId(null);
      }
      await loadContacts();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    setIsUpdatingStatus(true);
    try {
      await contactService.updateStatus(id, status);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <AdminHeader title="Contact enquiries" />

      <div className="grid max-h-[calc(100vh-10rem)] gap-6 overflow-hidden lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="shrink-0 text-lg font-semibold text-gray-900">Submissions</h2>
          <p className="mt-1 shrink-0 text-sm text-gray-500">
            {contacts.length} total
            {newCount > 0 ? ` · ${newCount} new` : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
                  statusFilter === filter
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {filter === "all" ? "All" : statusLabel[filter]}
              </button>
            ))}
          </div>

          <div className="relative mt-4 shrink-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, subject..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                }}
                onChange={toggleSelectAllFiltered}
                disabled={filteredContacts.length === 0 || isDeleting}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              Select all
            </label>
            <button
              type="button"
              onClick={() => {
                const ids = Array.from(selectedIds).filter((id) =>
                  filteredIds.includes(id)
                );
                handleDelete(ids, `${ids.length} selected enquiry(ies)`);
              }}
              disabled={
                isDeleting ||
                !Array.from(selectedIds).some((id) => filteredIds.includes(id))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Delete selected
            </button>
          </div>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : filteredContacts.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              {contacts.length === 0
                ? "No contact submissions yet. Enquiries from the contact page will appear here."
                : "No enquiries match your filters."}
            </p>
          ) : (
            <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredContacts.map((contact) => (
                <li key={contact._id}>
                  <div
                    className={cn(
                      "flex gap-2 rounded-lg border p-3 transition",
                      selectedId === contact._id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-100 bg-gray-50/80 hover:border-gray-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(contact._id)}
                      onChange={() => toggleSelect(contact._id)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isDeleting}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand focus:ring-brand"
                      aria-label={`Select ${contact.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => selectContact(contact._id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold leading-snug">
                          {contact.subject}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            selectedId === contact._id
                              ? "bg-white/20 text-white"
                              : statusBadgeClass[contact.status]
                          )}
                        >
                          {statusLabel[contact.status]}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "mt-1 truncate text-xs",
                          selectedId === contact._id ? "text-gray-300" : "text-gray-500"
                        )}
                      >
                        {contact.name}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[10px]",
                          selectedId === contact._id ? "text-gray-400" : "text-gray-400"
                        )}
                      >
                        {formatDate(contact.createdAt)}
                      </p>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <p className="p-6 text-sm text-gray-500">Loading enquiry...</p>
          ) : !selected ? (
            <p className="p-6 text-sm text-gray-500">
              Select an enquiry on the left to view full details.
            </p>
          ) : (
            <>
              <div className="shrink-0 border-b border-gray-100 px-6 pb-4 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-gray-900">{selected.subject}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Received {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs font-medium text-gray-500">Status</label>
                    <select
                      value={selected.status}
                      disabled={isUpdatingStatus}
                      onChange={(e) =>
                        handleStatusChange(selected._id, e.target.value as ContactStatus)
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <User className="h-4 w-4 text-gray-400" aria-hidden />
                      {selected.name}
                    </dd>
                  </div>

                  {selected.company ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Company
                      </dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-800">
                        <Building2 className="h-4 w-4 text-gray-400" aria-hidden />
                        {selected.company}
                      </dd>
                    </div>
                  ) : null}

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${selected.email}`}
                        className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
                      >
                        <Mail className="h-4 w-4" aria-hidden />
                        {selected.email}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </dt>
                    <dd className="mt-1">
                      {selected.phone ? (
                        <a
                          href={`tel:${selected.phone}`}
                          className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-brand hover:underline"
                        >
                          <Phone className="h-4 w-4 text-gray-400" aria-hidden />
                          {selected.phone}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">Not provided</span>
                      )}
                    </dd>
                  </div>

                  {selected.service ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Service interested in
                      </dt>
                      <dd className="mt-1 text-sm text-gray-800">{selected.service}</dd>
                    </div>
                  ) : null}

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Message
                    </dt>
                    <dd className="mt-2 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                      {selected.message}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="shrink-0 flex flex-wrap gap-3 border-t border-gray-100 px-6 py-4">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:border-brand/40 hover:text-brand"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Reply by email
                </a>
                <button
                  type="button"
                  onClick={() =>
                    handleDelete([selected._id], `enquiry from ${selected.name}`)
                  }
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
