export function NavItem({ href, onClick, children }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      {children}
    </a>
  );
}
