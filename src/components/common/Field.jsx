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
      <div className="mb-3 text-lg font-semibold text-black">
        {label} {required ? <span className="text-black">*</span> : null}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-16 w-full rounded-lg px-6 text-lg outline-none ring-0",
          "bg-[#E9FBE4]",
          "focus:ring-2",
          showError ? "ring-2 ring-red-400 focus:ring-red-400" : "focus:ring-[#66FF2A]",
        ].join(" ")}
        aria-invalid={showError ? "true" : "false"}
      />

      {showError ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
