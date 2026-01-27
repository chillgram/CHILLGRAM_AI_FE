export function Brand({ logoSrc, name }) {
  return (
    <a href={"/"}>
      <img src={logoSrc} alt={name} className="max-w-50" />
    </a>
  );
}
