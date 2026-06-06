"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { SunIcon, MoonIcon, SparklesIcon } from "@/components/ui/icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border-color bg-surface/80 backdrop-blur-md transition-colors duration-200">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5 text-xl font-display font-bold tracking-tight text-text-main" onClick={() => setOpen(false)}>
          Learn<span className="text-primary font-extrabold">Path</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        {/* Desktop Links & Theme Toggler */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={isActive(pathname, link.href)} />
            ))}
          </div>

          <div className="h-4 w-px bg-border-color" />

          {/* Theme switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border-color bg-surface p-1 shadow-sm">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-md hover:bg-bg-primary transition-colors cursor-pointer ${theme === "light" ? "text-primary bg-bg-primary" : "text-text-muted"}`}
              title="Light Theme"
            >
              <SunIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-md hover:bg-bg-primary transition-colors cursor-pointer ${theme === "dark" ? "text-primary bg-bg-primary" : "text-text-muted"}`}
              title="Dark Theme"
            >
              <MoonIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme("amber")}
              className={`p-1.5 rounded-md hover:bg-bg-primary transition-colors cursor-pointer ${theme === "amber" ? "text-primary bg-bg-primary" : "text-text-muted"}`}
              title="Amber Theme"
            >
              <SparklesIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-color bg-surface text-text-main hover:bg-bg-primary md:hidden focus:outline-none focus:ring-1 focus:ring-primary/20"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <span className="sr-only">Open main menu</span>
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {open && (
        <div id="site-menu" className="border-t border-border-color bg-surface px-4 py-4 md:hidden shadow-lg space-y-4">
          <div className="grid gap-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(pathname, link.href)}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>

          <div className="border-t border-border-color pt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Select Theme</span>
            <div className="flex items-center gap-1 rounded-lg border border-border-color bg-surface p-1 shadow-sm">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${theme === "light" ? "text-primary bg-bg-primary" : "text-text-muted"}`}
              >
                <SunIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${theme === "dark" ? "text-primary bg-bg-primary" : "text-text-muted"}`}
              >
                <MoonIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("amber")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${theme === "amber" ? "text-primary bg-bg-primary" : "text-text-muted"}`}
              >
                <SparklesIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-accent text-primary"
          : "text-text-muted hover:bg-bg-primary hover:text-text-main"
      }`}
    >
      {label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
