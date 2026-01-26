export function PrimaryButton({ children, disabled, onClick, className = "" }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "mt-10 h-16 w-full rounded-lg text-2xl font-extrabold text-black",
        disabled
          ? "bg-gray-200 cursor-not-allowed"
          : "bg-[#66FF2A] hover:brightness-95",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
