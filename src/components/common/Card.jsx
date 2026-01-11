import { cn } from "../../utils/cn";

export default function Card({ className, children }) {
  return <div className={cn("rounded-2xl border bg-white p-5 shadow-sm", className)}>{children}</div>;
}
