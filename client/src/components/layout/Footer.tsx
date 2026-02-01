'use client'

import Link from 'next/link'
import { Rocket, Twitter, Linkedin, Github } from 'lucide-react'

export const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 group mb-6">
                            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                <Rocket className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                LaunchPad
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            The premium benefits platform for modern startups. Save thousands on your tech stack and runway.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link href="/deals" className="hover:text-indigo-400 transition-colors">Browse Deals</Link></li>
                            <li><Link href="/register" className="hover:text-indigo-400 transition-colors">Get Started</Link></li>
                            <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Log In</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-slate-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} LaunchPad. All rights reserved.
                    </p>

                    <div className="flex space-x-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
