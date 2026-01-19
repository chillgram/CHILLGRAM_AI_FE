export function NavItem({ href, children }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      {children}
    </a>
  );
}
