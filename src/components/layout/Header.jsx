import Logo from "@/assets/image/chillgram_logo_sv.png";
import { Brand } from "../common/Brand";
import { NavMenu } from "../common/NavMenu";
import { CtaButton } from "../common/CtaButton";

export function Header() {
  const brand = { logoSrc: Logo, name: "chillgram", href: "/" };
  const links = [
    { label: "프로젝트 생성", href: "/projects/new" },
    { label: "Q&A", href: "/qna" },
  ];
  const cta = { label: "가입하기", href: "/signup" };

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Brand logoSrc={brand.logoSrc} name={brand.name} href={brand.href} />

        <div className="flex items-center gap-8">
          <NavMenu links={links} />
          <CtaButton label={cta.label} href={cta.href} />
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />
    </header>
  );
}
