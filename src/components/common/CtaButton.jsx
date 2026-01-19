export function CtaButton({ label, href, onClick }) {
  if (href) {
    return (
      <a
        href={href}
        className="inline-flex h-11 items-center justify-center rounded-md bg-[#66FF2A] px-6 text-sm font-semibold !text-black hover:brightness-95"
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center rounded-md bg-[#66FF2A] px-6 text-sm font-semibold text-black hover:brightness-95"
    >
      {label}
    </button>
  );
}
