import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const variants = {
  primary: "border-transparent bg-primary text-white hover:bg-secondary shadow-sm hover:shadow active:scale-[0.98] transition-all duration-150",
  secondary: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-150",
  ghost: "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
};

const sizes = {
  sm: "h-9 px-3.5 text-xs font-semibold rounded-md",
  md: "h-11 px-5 text-sm font-semibold rounded-lg",
  lg: "h-12 px-6 text-base font-semibold rounded-lg"
};

export function buttonClassName(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size]
  ].join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return <button className={`${buttonClassName(variant, size)} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
}) {
  return (
    <Link className={`${buttonClassName(variant, size)} ${className}`} {...props}>
      {children}
    </Link>
  );
}
