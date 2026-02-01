"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Lock, CheckCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

interface Deal {
  _id: string;
  title: string;
  description: string;
  partnerName: string;
  logoUrl: string;
  conditions: string;
  isLocked: boolean;
  category: string;
  partnerLink: string;
  discountValue: string;
}

export default function DealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const loadPageData = async () => {
      try {
        const [dealRes, claimsRes] = await Promise.all([
          api.get(`/deals/${id}`),
          api.get("/deals/user/claims"),
        ]);

        setDeal(dealRes.data);

        const hasClaimed = claimsRes.data.some(
          (claim: any) => claim.dealId._id === id || claim.dealId === id,
        );
        setIsAlreadyClaimed(hasClaimed);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [id]);

  const handleClaim = async () => {
    if (isAlreadyClaimed) return;

    setClaiming(true);
    setErrorMsg("");
    try {
      await api.post(`/deals/${id}/claim`);
      setClaimStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setClaimStatus("error");
      setErrorMsg(
        err.response?.data?.error || "Something went wrong while claiming.",
      );
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <div className="bg-slate-900 border border-white/10 p-12 rounded-[2.5rem] max-w-md shadow-2xl">
          <div className="bg-indigo-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="text-indigo-500 h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
            Members Only
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">
            Log in to view this exclusive perk and unlock your credits.
          </p>
          <Link href="/login" className="w-full">
            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20">
              Sign In to View
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <p className="text-slate-400 mb-6 font-medium">
          Deal not found or has expired.
        </p>
        <Link href="/deals">
          <button className="px-8 py-3 border border-white/10 hover:bg-white/5 rounded-xl transition-all text-sm font-bold">
            Back to Marketplace
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <Link
          href="/deals"
          className="inline-flex items-center text-slate-500 hover:text-white mb-10 transition-all group text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Browse Marketplace
        </Link>

        <div className="bg-slate-900/40 rounded-[3rem] overflow-hidden border border-white/5 backdrop-blur-md shadow-2xl">
          <div className="h-40 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/30 relative">
            <div className="absolute -bottom-12 left-10 h-28 w-28 bg-white rounded-[2rem] p-5 shadow-2xl flex items-center justify-center border border-white/10">
              <img
                src={deal.logoUrl}
                alt={deal.partnerName}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="pt-20 px-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-white tracking-tighter italic">
                  {deal.title}
                </h1>
                <p className="text-2xl text-indigo-400 font-black tracking-tight">
                  {deal.discountValue}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 bg-slate-800/80 px-4 py-2 rounded-full border border-white/5">
                  {deal.category}
                </span>
                {deal.isLocked && (
                  <div className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 flex items-center text-[10px] font-black uppercase tracking-[0.15em]">
                    <Lock className="h-3 w-3 mr-2" /> Locked
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 mb-6">
                    Overview
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-xl font-medium">
                    {deal.description}
                  </p>
                </section>

                {deal.conditions && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 mb-6">
                      Eligibility & Terms
                    </h3>
                    <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-white/5 text-slate-400 text-sm leading-8 font-medium italic border-l-indigo-500/50 border-l-4">
                      "{deal.conditions}"
                    </div>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-4">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] sticky top-32">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 text-center">
                    Redemption
                  </h3>

                  {claimStatus === "success" ? (
                    <div className="text-center py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                      <p className="font-black text-white text-lg tracking-tight">
                        Deal Secured
                      </p>
                      <p className="text-xs text-emerald-400/70 mt-2 font-bold uppercase tracking-widest animate-pulse">
                        Redirecting...
                      </p>
                    </div>
                  ) : isAlreadyClaimed ? (
                    <div className="space-y-4">
                      <button
                        disabled
                        className="w-full py-6 rounded-2xl bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs"
                      >
                        <ShieldCheck className="h-5 w-5" /> Already Claimed
                      </button>
                      <p className="text-[10px] text-center text-slate-500 font-bold px-6 leading-relaxed">
                        Instructions are waiting in your dashboard.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleClaim}
                      disabled={claiming}
                      className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {claiming ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                          <span>Processing</span>
                        </div>
                      ) : (
                        "Unlock Deal"
                      )}
                    </button>
                  )}

                  {errorMsg && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-[10px] font-black text-center uppercase tracking-tighter">
                        {errorMsg}
                      </p>
                    </div>
                  )}

                  {!isAlreadyClaimed && claimStatus !== "success" && (
                    <p className="mt-8 text-[10px] text-slate-600 text-center font-bold leading-relaxed uppercase tracking-tighter">
                      Clicking will notify the partner team. Check dashboard for
                      code details.
                    </p>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
