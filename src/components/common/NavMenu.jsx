import { NavItem } from "./NavItem";

export function NavMenu({ links = [] }) {
  return (
    <nav className="flex items-center gap-8">
      {links.map((link) => (
        <NavItem
          key={link.href || link.label}
          href={link.href}
          onClick={link.onClick}
        >
          {link.label}
        </NavItem>
      ))}
    </nav>
  );
}
