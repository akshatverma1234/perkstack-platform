"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Lock, CheckCircle, ArrowLeft, LogIn } from "lucide-react";
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

    const fetchDeal = async () => {
      try {
        const res = await api.get(`/deals/${id}`);
        setDeal(res.data);
      } catch (err) {
        console.error("Error fetching deal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handleClaim = async () => {
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
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="container mx-auto px-6 flex flex-col items-center justify-center pt-52">
          <div className="bg-slate-900/50 border border-white/10 p-10 rounded-3xl text-center max-w-md">
            <div className="bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-indigo-500 h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Sign In to View This Deal
            </h2>
            <p className="text-slate-400 mb-8">
              This deal is exclusive to our community. Please log in to view the
              details and claim your offer.
            </p>
            <Link href="/login" className="w-full">
              <Button size="lg" className="w-full gap-2">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <p className="text-slate-400 mb-4">We couldn't find that deal.</p>
        <Link href="/deals">
          <Button variant="outline">Back to browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <Link
          href="/deals"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Deals
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="h-32 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 relative">
              <div className="absolute -bottom-10 left-8 h-24 w-24 bg-white rounded-2xl p-4 shadow-2xl flex items-center justify-center border border-white/10">
                <img
                  src={deal.logoUrl}
                  alt={deal.partnerName}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="pt-14 px-8 pb-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {deal.title}
                  </h1>
                  <p className="text-xl text-indigo-400 font-semibold tracking-tight">
                    {deal.discountValue}
                  </p>
                </div>
                {deal.isLocked && (
                  <div className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 flex items-center text-sm font-medium">
                    <Lock className="h-4 w-4 mr-2" /> Locked
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
                <div className="md:col-span-2 space-y-10">
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                      Overview
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {deal.description}
                    </p>
                  </section>

                  {deal.conditions && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                        The Fine Print
                      </h3>
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 text-slate-400 text-sm leading-6 italic">
                        "{deal.conditions}"
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                      Claim Offer
                    </h3>

                    {claimStatus === "success" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/10 text-emerald-400 p-6 rounded-2xl flex flex-col items-center text-center border border-emerald-500/20"
                      >
                        <CheckCircle className="h-10 w-10 mb-3" />
                        <p className="font-bold">Deal Claimed!</p>
                        <p className="text-xs mt-2 opacity-70">
                          Taking you back to your dashboard...
                        </p>
                      </motion.div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full py-6 text-base font-bold shadow-lg shadow-indigo-500/20"
                        onClick={handleClaim}
                        disabled={claiming}
                      >
                        {claiming ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            Claiming...
                          </span>
                        ) : (
                          "Claim This Deal"
                        )}
                      </Button>
                    )}

                    {errorMsg && (
                      <p className="mt-4 text-red-400 text-xs text-center font-medium">
                        {errorMsg}
                      </p>
                    )}

                    <p className="mt-6 text-[10px] text-slate-500 text-center leading-relaxed">
                      Offer valid while supplies last. By clicking, you agree to
                      our reward policy.
                    </p>
                  </div>

                  <div className="px-2 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Industry</span>
                      <span className="text-slate-200 bg-slate-800 px-3 py-1 rounded-full text-xs">
                        {deal.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Provider</span>
                      <span className="text-slate-200 font-medium">
                        {deal.partnerName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
