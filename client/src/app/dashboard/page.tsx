"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/lib/api";
import { User, Copy, Check } from "lucide-react";

interface Claim {
  _id: string;
  dealId: {
    title: string;
    partnerName: string;
    logoUrl: string;
  };
  status: string;
  claimCode: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const u = localStorage.getItem("user");
        if (u) setUserData(JSON.parse(u));

        const res = await api.get("/deals/user/claims");
        setClaims(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center space-x-6 mb-12">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-3xl font-bold text-white">
              {userData?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData?.name || "User"}</h1>
            <p className="text-slate-400">{userData?.email}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">My Claims</h2>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-900 rounded-xl" />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500 mb-4">
              You haven't claimed any deals yet
            </p>
            <a
              href="/deals"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Browse Deals
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {claims.map((claim) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={claim._id}
                className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white rounded-lg p-2 flex items-center justify-center">
                    <img
                      src={claim.dealId.logoUrl}
                      alt={claim.dealId.partnerName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{claim.dealId.title}</h3>
                    <p className="text-sm text-slate-400">
                      Claimed on{" "}
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                      Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(claim.status)} uppercase`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  {claim.claimCode && (
                    <div className="flex flex-col w-full md:w-auto">
                      <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                        License Key
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(claim.claimCode, claim._id)
                        }
                        className="group relative flex items-center space-x-2 bg-slate-950/50 hover:bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 transition-colors text-mono"
                      >
                        <code className="text-indigo-300 font-mono">
                          {claim.claimCode}
                        </code>
                        {copiedId === claim._id ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-500 group-hover:text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
