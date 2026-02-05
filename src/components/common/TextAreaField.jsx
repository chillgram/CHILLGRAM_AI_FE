export function TextAreaField({
  label,
  required,
  value,
  onChange,
  error,
  touched,
  placeholder,
  minHeight = 160,
  variant = "neutral",
}) {
  const showError = Boolean(touched && error);

  const labelClass =
    variant === "neutral"
      ? "mb-2 block text-sm font-bold text-[#111827]"
      : "mb-3 text-lg font-semibold text-black";

  const areaBase = "w-full outline-none";
  const areaNeutral = [
    "rounded-xl border px-4 py-3 text-sm",
    "bg-[#F9FAFB] border-gray-200",
    "focus:ring-2 focus:ring-gray-300",
  ].join(" ");

  const areaClass = [
    areaBase,
    variant === "neutral" ? areaNeutral : areaNeutral,
    showError ? "ring-2 ring-red-400 focus:ring-red-400" : "",
  ].join(" ");

  return (
    <label className="block">
      <div className={labelClass}>
        {label} {required ? <span className="text-black">*</span> : null}
      </div>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={areaClass}
        style={{ minHeight }}
        aria-invalid={showError ? "true" : "false"}
      />

      {showError ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
