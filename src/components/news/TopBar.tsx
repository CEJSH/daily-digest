import { Link } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-editorial items-center justify-between px-6 py-3 md:px-8">
        <Link to="/" className="group flex flex-col items-start leading-tight md:flex-row md:items-baseline md:gap-3">
          {/* Wordmark — serif, full ink */}
          <span className="font-serif text-lg font-bold tracking-tight text-foreground md:text-xl">
            Daily Digest
          </span>
          {/* Subtitle — sans, 60% 농도, 모바일에서도 항상 노출 (정체성 시그널) */}
          <span className="text-[0.6875rem] text-foreground/60">
            오늘, 당신을 위한 최소한의 뉴스
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {/* Menu — sans, 70% 농도, 트래킹 0.08em */}
          <Link
            to="/archive"
            className="hidden px-3 py-2 text-[0.6875rem] font-medium tracking-[0.08em] text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline sm:inline-block"
          >
            지난 호
          </Link>
          <span className="hidden h-4 w-px bg-border sm:inline-block" />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
