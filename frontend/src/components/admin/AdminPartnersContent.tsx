"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPartnerForm } from "@/components/admin/AdminPartnerForm";
import { getApiErrorMessage } from "@/lib/api-error";
import { getPartnerLogoUrl } from "@/lib/uploads";
import { partnerService } from "@/services";
import type { Partner } from "@/types";

export function AdminPartnersContent() {
  const [items, setItems] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const res = await partnerService.getAll();
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

  const handleDelete = async (item: Partner) => {
    if (!confirm(`Delete partner "${item.name}"?`)) return;
    try {
      await partnerService.delete(item._id);
      toast.success("Partner deleted");
      if (editing?._id === item._id) setEditing(null);
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <>
      <AdminHeader title="Partner logos" />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AdminPartnerForm
          editing={editing}
          onCancelEdit={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            loadItems();
          }}
        />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Trusted partners</h2>
          <p className="mt-1 text-sm text-gray-500">{items.length} logo(s)</p>
          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No partner logos yet.
            </p>
          ) : (
            <ul className="mt-6 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {items.map((item) => {
                const logoSrc = getPartnerLogoUrl(item.logo);
                return (
                  <li
                    key={item._id}
                    className="rounded-lg border border-gray-100 bg-gray-50/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {logoSrc && (
                          <div className="relative h-10 w-24 shrink-0">
                            <Image
                              src={logoSrc}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-contain object-left"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              item.published
                                ? "bg-brand-muted/60 text-green-800"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {item.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          className="rounded-md p-2 text-gray-600 hover:bg-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-md p-2 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
