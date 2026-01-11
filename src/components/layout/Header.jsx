import Container from "../common/Container";
import Button from "../common/Button";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <Container className="flex h-14 items-center justify-between">
        <div className="font-bold">CHILLGRAM</div>

        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          <a className="hover:text-black" href="#features">기능</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">로그인</Button>
          <Button size="sm">시작하기</Button>
        </div>
      </Container>
    </header>
  );
}
