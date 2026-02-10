export function Brand({ logoSrc, name }) {
  return (
    <a href={"/"}>
      <img src={logoSrc} alt={name} className="max-w-30 mix-blend-multiply" />
    </a>
  );
}
