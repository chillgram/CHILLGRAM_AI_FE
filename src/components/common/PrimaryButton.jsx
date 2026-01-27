export function PrimaryButton({
  children,
  className = "",
  type = "submit",
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        "mt-10 h-16 w-full rounded-lg text-2xl font-extrabold text-black",
        props.disabled
          ? "bg-gray-200 cursor-not-allowed"
          : "bg-[#66FF2A] hover:brightness-95",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
