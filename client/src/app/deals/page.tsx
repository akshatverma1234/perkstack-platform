"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Lock, Compass, Tag, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/lib/api";
import Link from "next/link";

interface Deal {
  _id: string;
  title: string;
  description: string;
  partnerName: string;
  logoUrl: string;
  isLocked: boolean;
  category: string;
  discountValue: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/deals");
        setDeals(res.data);
        const uniqueCats = [
          "All",
          ...(Array.from(
            new Set(res.data.map((d: Deal) => d.category)),
          ) as string[]),
        ];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter((deal) => {
    const query = search.toLowerCase();
    const matchesSearch =
      deal.title.toLowerCase().includes(query) ||
      deal.partnerName.toLowerCase().includes(query);
    const matchesFilter =
      activeCategory === "All" || deal.category === activeCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Compass className="h-3.5 w-3.5" />
              Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Premium Benefits
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Hand-picked deals and credits to extend your startup runway.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by tool or partner..."
                className="h-12 w-full pl-11 pr-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[320px] rounded-[2.5rem] bg-slate-900/50 animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredDeals.map((deal) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={deal._id}
                >
                  <Link href={`/deals/${deal._id}`}>
                    <div className="group relative h-full bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 hover:bg-slate-900/60 hover:border-white/10 transition-all duration-500 cursor-pointer flex flex-col shadow-2xl">
                      <div className="flex items-start justify-between mb-8">
                        <div className="h-16 w-16 rounded-2xl bg-white p-3 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                          <img
                            src={deal.logoUrl}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {deal.isLocked ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-white/5 text-[10px] font-black uppercase text-amber-500 tracking-tight">
                              <Lock className="h-3 w-3" />
                              Locked
                            </div>
                          ) : (
                            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase text-indigo-400 tracking-tight">
                              Unlocked
                            </div>
                          )}

                          {deal.discountValue && (
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-400 tracking-tight">
                              {deal.discountValue}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-8 flex-grow">
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                          {deal.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                          {deal.description}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Tag className="h-3.5 w-3.5 text-indigo-500/50" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">
                            {deal.category}
                          </span>
                        </div>
                        <span className="text-indigo-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Perk <ArrowRight />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredDeals.length === 0 && (
          <div className="text-center py-32">
            <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Search className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No results found
            </h3>
            <p className="text-slate-500">
              We couldn't find any deals matching your current search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-6 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
