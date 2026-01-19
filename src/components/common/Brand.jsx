export function Brand({ logoSrc, name, href = "/" }) {
  return (
    <a href={href} className="flex items-center">
      <img src={logoSrc} alt={name} className="h-full max-h-12 w-auto" />
      {/* <span className="text-lg font-semibold text-gray-800">{name}</span> */}
    </a>
  );
}