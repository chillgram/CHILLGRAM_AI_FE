export function SelectField({ label, required, value, onChange, options, placeholder, }) {
  return (
    <label className="block">
      <div className="mb-3 text-lg font-semibold text-black">
        {label} {required ? <span className="text-black">*</span> : null}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-16 w-full rounded-lg bg-[#E9FBE4] px-6 text-lg outline-none ring-0 focus:ring-2 focus:ring-[#66FF2A]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
