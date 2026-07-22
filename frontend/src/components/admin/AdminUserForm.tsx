"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  ADMIN_PERMISSIONS,
  EMPTY_PERMISSIONS,
} from "@/lib/admin-permissions";
import { userService } from "@/services";
import type { AdminPermission, AdminPermissions, StaffUser } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  email: "",
  password: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface AdminUserFormProps {
  onSuccess: () => void;
  editing?: StaffUser | null;
  onCancelEdit?: () => void;
}

export function AdminUserForm({ onSuccess, editing, onCancelEdit }: AdminUserFormProps) {
  const isEditing = Boolean(editing);
  const [permissions, setPermissions] = useState<AdminPermissions>({ ...EMPTY_PERMISSIONS });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        email: editing.email,
        password: "",
      });
      setPermissions({ ...EMPTY_PERMISSIONS, ...editing.permissions });
    } else {
      form.reset(defaultValues);
      setPermissions({ ...EMPTY_PERMISSIONS });
    }
  }, [editing, form]);

  const togglePermission = (key: AdminPermission) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (values: FormValues) => {
    const hasAny = ADMIN_PERMISSIONS.some(({ key }) => permissions[key]);
    if (!hasAny) {
      toast.error("Select at least one admin section");
      return;
    }

    if (!isEditing && (!values.password || values.password.length < 6)) {
      toast.error("Password is required (min 6 characters)");
      return;
    }

    if (isEditing && values.password && values.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      permissions,
      ...(values.password?.trim() ? { password: values.password } : {}),
    };

    try {
      if (isEditing && editing) {
        await userService.update(editing._id, payload);
        toast.success("User updated");
      } else {
        await userService.create({
          ...payload,
          password: values.password!,
        });
        toast.success("User created");
      }
      form.reset(defaultValues);
      setPermissions({ ...EMPTY_PERMISSIONS });
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditing ? "Edit staff user" : "Add staff user"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Create login credentials and choose which admin sections they can open.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Name *</label>
          <input {...form.register("name")} className={inputClass} placeholder="Jane Doe" />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Email *</label>
          <input
            type="email"
            {...form.register("email")}
            className={inputClass}
            placeholder="user@crusoetec.com"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">
            Password {isEditing ? "(leave blank to keep current)" : "*"}
          </label>
          <input
            type="text"
            autoComplete="new-password"
            {...form.register("password")}
            className={inputClass}
            placeholder={isEditing ? "••••••••" : "Min 6 characters"}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-800">Admin access *</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ADMIN_PERMISSIONS.map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 text-sm text-gray-800"
              >
                <input
                  type="checkbox"
                  checked={permissions[key]}
                  onChange={() => togglePermission(key)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand/30"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update" : "Add user"}
        </Button>
        {isEditing && onCancelEdit && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
