'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Lock, Unlock, Filter } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import Link from 'next/link'

interface Deal {
    _id: string
    title: string
    description: string
    partnerName: string
    logoUrl: string
    isLocked: boolean
    category: string
    discountValue: string
}

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [categories, setCategories] = useState<string[]>(['All'])

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await api.get('/deals')
                setDeals(res.data)
                const cats = ['All', ...Array.from(new Set(res.data.map((d: Deal) => d.category))) as string[]]
                setCategories(cats)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchDeals()
    }, [])

    const filteredDeals = deals.filter(deal => {
        const matchesSearch = deal.title.toLowerCase().includes(search.toLowerCase()) ||
            deal.partnerName.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'All' || deal.category === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Explore Marketplace</h1>
                        <p className="text-slate-400">Discover tools to scale your business</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search deals..."
                                className="pl-10 h-11 w-full sm:w-64 bg-slate-900 rounded-xl border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                            {categories.slice(0, 3).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === cat
                                            ? 'bg-slate-800 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 rounded-2xl bg-slate-900 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredDeals.map((deal) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={deal._id}
                                >
                                    <Link href={`/deals/${deal._id}`}>
                                        <div className="group relative h-full glass-card rounded-2xl p-6 hover:bg-slate-800/50 transition-colors cursor-pointer overflow-hidden border border-slate-800 hover:border-indigo-500/30">
                                            {deal.isLocked && (
                                                <div className="absolute top-4 right-4 bg-slate-950/50 backdrop-blur rounded-full px-3 py-1 flex items-center space-x-1 border border-white/5">
                                                    <Lock className="h-3 w-3 text-amber-500" />
                                                    <span className="text-xs font-medium text-amber-500">Locked</span>
                                                </div>
                                            )}

                                            <div className="flex items-start justify-between mb-6">
                                                <div className="h-14 w-14 rounded-xl bg-white p-2 flex items-center justify-center">
                                                    <img src={deal.logoUrl} alt={deal.partnerName} className="h-full w-full object-contain" />
                                                </div>
                                                {deal.discountValue && (
                                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20">
                                                        {deal.discountValue}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{deal.title}</h3>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{deal.description}</p>

                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-500">
                                                <span>{deal.category}</span>
                                                <span className="group-hover:translate-x-1 transition-transform text-indigo-400 font-medium">View Details &rarr;</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
