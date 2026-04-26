import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TopBar, Footer } from "@/components/news";

const Archive = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <div className="mx-auto max-w-prose px-6 md:px-8">
        <main>
          <header className="pb-10 pt-12 md:pb-14 md:pt-16">
            <p className="eyebrow text-accent">Archive</p>
            <h1 className="mt-4 font-serif text-[2.25rem] font-bold leading-[1.1] tracking-[-0.03em] md:text-[3rem]">
              지난 호 모아보기
            </h1>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-foreground/65 md:text-[1.0625rem]">
              아직 아카이브를 준비하고 있습니다.
              과거 다이제스트는 곧 이곳에서 다시 읽어볼 수 있게 됩니다.
            </p>
          </header>

          <section className="border-y border-border py-20 text-center">
            <p className="eyebrow text-foreground/65">Coming Soon</p>
            <p className="mt-4 font-serif text-xl text-foreground/70 md:text-2xl">
              준비 중입니다.
            </p>
            <Link
              to="/"
              className="group mt-10 inline-flex items-center gap-1.5 text-sm text-foreground/65 transition-colors hover:text-foreground"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={1.6}
              />
              <span className="border-b border-foreground/20 pb-0.5 transition-colors group-hover:border-foreground">
                오늘의 다이제스트로 돌아가기
              </span>
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Archive;
