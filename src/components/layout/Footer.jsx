import Container from "../common/Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <Container className="py-10 text-sm text-gray-600">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} CHILLGRAM. All rights reserved.</div>
        </div>
      </Container>
    </footer>
  );
}