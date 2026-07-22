"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminHeroSlideForm } from "@/components/admin/AdminHeroSlideForm";
import { getApiErrorMessage } from "@/lib/api-error";
import { getHeroSlideIconUrl, getHeroSlideImageUrl } from "@/lib/uploads";
import { heroSlideService } from "@/services";
import type { HeroSlide } from "@/types";

export function AdminHeroSlidesContent() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSlide | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const res = await heroSlideService.getAll();
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

  const handleDelete = async (item: HeroSlide) => {
    if (!confirm(`Delete hero slide "${item.title}"?`)) return;
    try {
      await heroSlideService.delete(item._id);
      toast.success("Hero slide deleted");
      if (editing?._id === item._id) setEditing(null);
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <>
      <AdminHeader title="Hero slides" />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AdminHeroSlideForm
          editing={editing}
          onCancelEdit={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            loadItems();
          }}
        />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Homepage hero slider</h2>
          <p className="mt-1 text-sm text-gray-500">{items.length} slide(s)</p>
          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No hero slides yet.
            </p>
          ) : (
            <ul className="mt-6 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {items.map((item) => {
                const imageSrc = getHeroSlideImageUrl(item.image);
                const iconSrc = getHeroSlideIconUrl(item.icon);
                return (
                  <li
                    key={item._id}
                    className="rounded-lg border border-gray-100 bg-gray-50/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        {imageSrc && (
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={imageSrc}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {iconSrc && (
                              <div className="relative h-8 w-8 shrink-0">
                                <Image
                                  src={iconSrc}
                                  alt=""
                                  fill
                                  unoptimized
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <p className="truncate font-semibold text-gray-900">{item.title}</p>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                            {item.description}
                          </p>
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
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
