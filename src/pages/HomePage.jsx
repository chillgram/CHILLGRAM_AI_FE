export default function HomePage() {
  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-[#3b312b] md:text-6xl">
            <span className="text-[#66FF2A]">AI</span>로 완성하는
            <br />
            완벽한 패키지 디자인
          </h1>

          <p className="mx-auto mt-10 max-w-4xl text-lg leading-relaxed text-[#3b312b]/80 md:text-xl">
            소비자 데이터 기반 패키지 기획부터 디자인 생성과 광고영상 제작까지
            <br />
            전 과정을 자동화한 AI 패키지 올인원 플랫폼
          </p>

          <div className="mt-12 flex justify-center">
            <a
              href="#"
              className="inline-flex h-16 items-center justify-center rounded-md bg-[#66FF2A] px-16 text-xl font-extrabold !text-black shadow-sm hover:brightness-95"
            >
              무료로 시작하기
            </a>
          </div>
        </div>
      </section>

      {/* “핵심 기능” 타이틀 영역 */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 pb-16 text-center">
          <h2 className="text-5xl font-extrabold tracking-tight text-[#3b312b]">
            핵심 기능
          </h2>
          <p className="mt-6 text-2xl font-medium text-black">
            AI 기술로 패키지 디자인 프로세스를 혁신합니다
          </p>
        </div>
      </section>
    </div>
  );
}
