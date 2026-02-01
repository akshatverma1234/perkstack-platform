"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User as UserIcon,
  Hexagon,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Deals", href: "/deals" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Hexagon className="h-5 w-5 text-white fill-white/10" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            Perkstack
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 border-r border-white/10 pr-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-indigo-400 ${
                  pathname === link.href ? "text-indigo-400" : "text-slate-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
                <Link href="/dashboard">
                  <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all text-indigo-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link href="/register">
                  <button className="bg-white text-slate-950 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2 text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-6 py-10 space-y-8">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-white hover:text-indigo-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full py-4 rounded-2xl border border-white/10 text-white font-bold">
                      Login
                    </button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/20">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
