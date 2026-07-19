"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, X, Loader2 } from "lucide-react";
import { updateCustomerAction, deleteCustomerAction } from "@/app/actions/admin/customers.actions";
import type { Profile } from "@/lib/supabase/types";

interface Props {
  profile: Profile;
}

export function CustomerActionButtons({ profile }: Props) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    phone: profile.phone || "",
    role: profile.role || "customer",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "firstName" || name === "lastName") {
      filteredValue = value.replace(/[^a-zA-Z]/g, "").slice(0, 20);
    } else if (name === "phone") {
      filteredValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [name]: filteredValue }));
    setError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation checks
    const nameRegex = /^[a-zA-Z]+$/;
    if (!form.firstName || !nameRegex.test(form.firstName) || form.firstName.length > 20) {
      setError("First name must contain only alphabets and be maximum 20 characters.");
      setIsLoading(false);
      return;
    }
    if (!form.lastName || !nameRegex.test(form.lastName) || form.lastName.length > 20) {
      setError("Last name must contain only alphabets and be maximum 20 characters.");
      setIsLoading(false);
      return;
    }
    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await updateCustomerAction(profile.id, form);
      if (!res.success) {
        setError(res.error || "Failed to update user");
      } else {
        setIsEditOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await deleteCustomerAction(profile.id);
      if (!res.success) {
        setError(res.error || "Failed to delete user");
      } else {
        setIsDeleteOpen(false);
        router.push("/admin/customers");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2.5 justify-center mt-4">
      {/* Edit Trigger */}
      <button
        onClick={() => setIsEditOpen(true)}
        className="flex items-center justify-center gap-1.5 flex-1 bg-white border border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#1A1A1A] font-semibold py-2 px-3 rounded-xl text-xs transition-all duration-300"
      >
        <Edit size={13} />
        Edit Details
      </button>

      {/* Delete Trigger */}
      <button
        onClick={() => setIsDeleteOpen(true)}
        className="flex items-center justify-center gap-1.5 flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 rounded-xl text-xs transition-all duration-300"
      >
        <Trash2 size={13} />
        Delete User
      </button>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-left">
          <div onClick={() => !isLoading && setIsEditOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#FFE4C2] z-10 mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0F0F0]">
              <div>
                <h3 className="text-lg font-black text-[#1A1A1A]">Edit User Info</h3>
                <p className="text-xs text-[#6B6B6B]">Modify name, phone or role attributes.</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} disabled={isLoading} className="text-[#6B6B6B] hover:text-red-500">
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-xs text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-xs text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-xs text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                  User Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-xs text-[#1A1A1A] bg-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-[#F0F0F0] mt-5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsEditOpen(false)}
                  className="px-3 py-2 rounded-xl border border-[#E5E5E5] hover:bg-[#FAFAFA] text-xs font-semibold text-[#6B6B6B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 bg-[#FF8A00] text-white hover:bg-[#FFB449] hover:text-[#1A1A1A] px-4 py-2 rounded-xl font-semibold transition-all text-xs disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={13} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-left">
          <div onClick={() => !isLoading && setIsDeleteOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-red-100 z-10 mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-black text-red-600 mb-2">Delete User Account?</h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed mb-5">
              Are you sure you want to permanently delete <strong>{[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "this user"}</strong>? This action will immediately remove their login credentials and profiles data, and cannot be undone.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-2.5 justify-end">
              <button
                disabled={isLoading}
                onClick={() => setIsDeleteOpen(false)}
                className="px-3 py-2 rounded-xl border border-[#E5E5E5] hover:bg-[#FAFAFA] text-xs font-semibold text-[#6B6B6B]"
              >
                Keep Account
              </button>
              <button
                disabled={isLoading}
                onClick={handleDeleteSubmit}
                className="flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl font-semibold transition-all text-xs disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={13} /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
