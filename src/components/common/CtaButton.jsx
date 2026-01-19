export function CtaButton({ label, href }) {
  return (
     <a href={href}
      className="inline-flex h-11 items-center justify-center rounded-md bg-[#6CFF2A] px-6 text-sm font-semibold text-black hover:brightness-95"
    >
      {label}
    </a>
  );
}
