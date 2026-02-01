"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Rocket, Loader2 } from "lucide-react";
import { TextField } from "@mui/material";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/deals");
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30 text-slate-200">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-12">
        <div className="w-full max-w-[440px]">
          <div className="bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl">
            <div className="text-center mb-10">
              <div className="h-12 w-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                <Rocket className="h-6 w-6 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight italic">
                Join Perkstack
              </h2>
              <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">
                Unlock $100k+ in SaaS credits
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                InputProps={{
                  style: { backgroundColor: "#ffffff", borderRadius: "14px" },
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                InputProps={{
                  style: { backgroundColor: "#ffffff", borderRadius: "14px" },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                InputProps={{
                  style: { backgroundColor: "#ffffff", borderRadius: "14px" },
                }}
              />

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-tighter text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating account</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Already part of the community?
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
