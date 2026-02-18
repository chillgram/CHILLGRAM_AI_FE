export function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
  error, // string | null
  touched, // boolean
  placeholder,
}) {
  const showError = Boolean(touched && error);

  return (
    <label className="block">
      <div className="mb-3 text-sm font-semibold text-black">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-12 w-full rounded-lg px-6 text-sm outline-none ring-0",
          "bg-primary/5",
          "focus:ring-2",
          showError
            ? "ring-2 ring-red-400 focus:ring-red-400"
            : "focus:ring-primary",
        ].join(" ")}
        aria-invalid={showError ? "true" : "false"}
      />

      {showError ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
