"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, Pencil, Plus, Trash2, Users } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  ADMIN_PERMISSIONS,
  EMPTY_PERMISSIONS,
} from "@/lib/admin-permissions";
import { userService } from "@/services";
import type { AdminPermissions, AdminUserRecord } from "@/types";

const userFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

function PermissionCheckboxes({
  value,
  onChange,
}: {
  value: AdminPermissions;
  onChange: (next: AdminPermissions) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ADMIN_PERMISSIONS.map(({ key, label }) => (
        <label
          key={key}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
            className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
          />
          {label}
        </label>
      ))}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function formatPermissionSummary(permissions?: AdminPermissions) {
  if (!permissions) return "—";
  const labels = ADMIN_PERMISSIONS.filter(({ key }) => permissions[key]).map(
    ({ label }) => label
  );
  return labels.length ? labels.join(", ") : "No access";
}

export function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRecord | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissions>({
    ...EMPTY_PERMISSIONS,
  });
  const [saving, setSaving] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userService.list();
      setUsers(res.data?.users ?? []);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openCreate = () => {
    setEditing(null);
    setPermissions({ ...EMPTY_PERMISSIONS });
    setPasswordValue("");
    form.reset({ name: "", email: "", password: "" });
    setModalOpen(true);
  };

  const openEdit = (user: AdminUserRecord) => {
    setEditing(user);
    setPermissions({ ...EMPTY_PERMISSIONS, ...user.permissions });
    const pwd = user.passwordPlain ?? "";
    setPasswordValue(pwd);
    form.reset({ name: user.name, email: user.email, password: pwd });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setPasswordValue("");
  };

  const onSubmit = async (values: UserFormValues) => {
    const hasAny = Object.values(permissions).some(Boolean);
    if (!hasAny) {
      toast.error("Select at least one section access permission");
      return;
    }

    setSaving(true);
    try {
      const trimmedPassword = passwordValue.trim();

      if (editing) {
        const payload: {
          name: string;
          email: string;
          permissions: AdminPermissions;
          password?: string;
        } = {
          name: values.name,
          email: values.email,
          permissions,
        };
        if (trimmedPassword) {
          payload.password = trimmedPassword;
        } else {
          toast.error("Password is required");
          setSaving(false);
          return;
        }
        await userService.update(editing._id, payload);
        toast.success("User updated");
      } else {
        if (!trimmedPassword) {
          toast.error("Password is required for new users");
          setSaving(false);
          return;
        }
        if (trimmedPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setSaving(false);
          return;
        }
        await userService.create({
          name: values.name,
          email: values.email,
          password: trimmedPassword,
          permissions,
        });
        toast.success("User created");
      }
      closeModal();
      await loadUsers();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (user: AdminUserRecord) => {
    if (user.role === "admin") {
      toast.error("Administrator accounts cannot be deleted here");
      return;
    }
    if (!window.confirm(`Delete user ${user.email}?`)) return;

    try {
      await userService.remove(user._id);
      toast.success("User deleted");
      await loadUsers();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const staffUsers = users.filter((u) => u.role !== "admin");
  const adminUsers = users.filter((u) => u.role === "admin");

  return (
    <div>
      <AdminHeader
        title="Users"
        description="Create team accounts with email and password. Assign access to blogs, jobs, and other sections."
        action={
          <Button type="button" onClick={openCreate} className="gap-2">
            <Plus size={16} />
            Add user
          </Button>
        }
      />

      {isLoading ? (
        <p className="mt-8 text-sm text-gray-500">Loading users...</p>
      ) : (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              <Users size={16} />
              Administrators
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">Full access (OTP login)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Team members
            </h2>
            {staffUsers.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No team users yet. Add a user to grant section access.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Access</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {staffUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatPermissionSummary(user.permissions)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(user)}
                              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                              aria-label="Edit user"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(user)}
                              className="rounded-md p-2 text-red-600 hover:bg-red-50"
                              aria-label="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editing ? "Edit user" : "Add user"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Team members sign in with email and password. You can view and update the
              password below (use the eye icon to show or hide).
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <PasswordField
                label="Password"
                value={passwordValue}
                onChange={(val) => {
                  setPasswordValue(val);
                  form.setValue("password", val, { shouldValidate: true });
                }}
                placeholder={editing && !passwordValue ? "No password on file — enter one" : "Min. 6 characters"}
                error={form.formState.errors.password?.message}
              />
              {editing && !editing.passwordPlain && (
                <p className="text-xs text-amber-700">
                  This user was created before password storage was enabled. Set a password
                  and save to record it here.
                </p>
              )}

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Section access</p>
                <PermissionCheckboxes value={permissions} onChange={setPermissions} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Save changes" : "Create user"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
