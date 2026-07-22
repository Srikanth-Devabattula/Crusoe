"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminUserForm } from "@/components/admin/AdminUserForm";
import { ADMIN_PERMISSIONS } from "@/lib/admin-permissions";
import { getApiErrorMessage } from "@/lib/api-error";
import { userService } from "@/services";
import type { StaffUser } from "@/types";

function permissionSummary(user: StaffUser) {
  const labels = ADMIN_PERMISSIONS.filter(({ key }) => user.permissions?.[key]).map(
    ({ label }) => label
  );
  return labels.length ? labels.join(", ") : "No access";
}

export function AdminUsersContent() {
  const [items, setItems] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<StaffUser | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const res = await userService.getAll();
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

  const handleDelete = async (item: StaffUser) => {
    if (!confirm(`Delete user "${item.email}"?`)) return;
    try {
      await userService.delete(item._id);
      toast.success("User deleted");
      if (editing?._id === item._id) setEditing(null);
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <>
      <AdminHeader title="Users" />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AdminUserForm
          editing={editing}
          onCancelEdit={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            loadItems();
          }}
        />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Staff accounts</h2>
          <p className="mt-1 text-sm text-gray-500">{items.length} user(s)</p>
          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No staff users yet. Add one to share admin access.
            </p>
          ) : (
            <ul className="mt-6 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="rounded-lg border border-gray-100 bg-gray-50/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-0.5 truncate text-sm text-gray-600">{item.email}</p>
                      {item.passwordPlain ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Password: <span className="font-mono text-gray-700">{item.passwordPlain}</span>
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs leading-relaxed text-gray-600">
                        Access: {permissionSummary(item)}
                      </p>
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
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
