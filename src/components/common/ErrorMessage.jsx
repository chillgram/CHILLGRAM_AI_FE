import { cn } from "../../utils/cn";

export default function ErrorMessage({ message, className }) {
  if (!message) return null;
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700", className)}>
      {message}
    </div>
  );
}
