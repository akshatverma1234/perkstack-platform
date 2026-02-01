"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/lib/api";
import { Ticket, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Claim {
  _id: string;
  dealId: {
    _id: string;
    title: string;
    partnerName: string;
    logoUrl: string;
  };
  status: "pending" | "approved" | "rejected";
  claimCode: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserData(JSON.parse(storedUser));

        const res = await api.get("/deals/user/claims");
        setClaims(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalClaims = claims.length;
  const approvedCount = claims.filter((c) => c.status === "approved").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-24 max-w-5xl">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {userData?.name
                ? `Welcome, ${userData.name.split(" ")[0]}`
                : "Your Dashboard"}
            </h1>
            <p className="text-slate-500 mt-1">{userData?.email}</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-slate-900 border border-white/5 px-5 py-3 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Total
              </p>
              <p className="text-xl font-bold text-white">{totalClaims}</p>
            </div>
            <div className="bg-slate-900 border border-white/5 px-5 py-3 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Approved
              </p>
              <p className="text-xl font-bold text-emerald-400">
                {approvedCount}
              </p>
            </div>
          </div>
        </section>

        <h2 className="text-lg font-bold text-white mb-6">Recent Claims</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-900/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-white/5">
            <Ticket className="h-10 w-10 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 mb-6">
              You haven't claimed any deals yet.
            </p>
            <Link
              href="/deals"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {claims.map((claim) => (
              <div
                key={claim._id}
                className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl p-2 flex-shrink-0">
                    <img
                      src={claim.dealId.logoUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {claim.dealId.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {claim.dealId.partnerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-slate-600 uppercase font-bold mb-1">
                      Date
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-tight ${
                      claim.status === "approved"
                        ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                        : claim.status === "pending"
                          ? "bg-amber-500/5 text-amber-500 border-amber-500/10"
                          : "bg-red-500/5 text-red-500 border-red-500/10"
                    }`}
                  >
                    {claim.status}
                  </div>

                  <Link
                    href={`/deals/${claim.dealId._id}`}
                    className="text-slate-600 hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
