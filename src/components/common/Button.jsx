import { cn } from "../../utils/cn";

export default function Button({
  className,
  variant = "primary", // primary | secondary | ghost
  size = "md",         // sm | md | lg
  type = "button",
  disabled,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-black text-white hover:bg-black/90 focus:ring-black",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
