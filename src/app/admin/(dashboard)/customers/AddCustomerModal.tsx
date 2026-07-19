"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Eye, EyeOff } from "lucide-react";
import { createCustomerAction } from "@/app/actions/admin/customers.actions";

export function AddCustomerModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "customer" as "customer" | "admin",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

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
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }
    if (!form.email || !form.email.includes("@")) {
      setError("Invalid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await createCustomerAction(form);
      if (!res.success) {
        setError(res.error || "Failed to create user");
      } else {
        setSuccess(true);
        router.refresh();
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "customer",
        });
        // Close modal after brief success window
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#FF8A00] text-white hover:bg-[#FFB449] hover:text-[#1A1A1A] px-4 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 text-sm"
      >
        <Plus size={16} />
        Add Customer
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            onClick={() => !isLoading && setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog Body */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-[#FFE4C2] z-10 mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#FFE4C2]/30 blur-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0F0F0]">
              <div>
                <h3 className="text-xl font-black text-[#1A1A1A]">Add New User</h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">Create a new customer, connector, or admin account.</p>
              </div>
              <button
                disabled={isLoading}
                onClick={() => setIsOpen(false)}
                className="text-[#6B6B6B] hover:text-red-500 hover:bg-red-55 p-1.5 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error or Success Notifications */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 p-3.5 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping" />
                User created successfully!
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Priya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-sm text-[#1A1A1A]"
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
                    placeholder="Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-sm text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="priya@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-sm text-[#1A1A1A]"
                />
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
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-sm text-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                    Password (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Auto-generated if blank"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-sm text-[#1A1A1A] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#FFB449] focus:outline-none text-sm text-[#1A1A1A] bg-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[#F0F0F0] mt-6">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] hover:bg-[#FAFAFA] text-sm font-semibold text-[#6B6B6B] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-[#FF8A00] text-white hover:bg-[#FFB449] hover:text-[#1A1A1A] px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all text-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
