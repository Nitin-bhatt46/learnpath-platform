import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Footer() {
  return (
    <footer className="border-t border-border-color bg-surface px-4 py-10 text-text-muted sm:px-6 transition-colors duration-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-md font-display font-bold text-text-main">
            Learn<span className="text-primary">Path</span>
          </Link>
          <p className="mt-1.5 text-xs text-text-muted/80">
            Premium software engineering learning roadmaps.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs font-semibold text-text-muted hover:text-primary transition-colors duration-150">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mx-auto mt-8 max-w-5xl border-t border-border-color/50 pt-6 text-left">
        <p className="text-xs text-text-muted/60">
          © {new Date().getFullYear()} LearnPath. All rights reserved. Built for professional software developers.
        </p>
      </div>
    </footer>
  );
}
