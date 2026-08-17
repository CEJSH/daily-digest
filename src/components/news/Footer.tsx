import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-rule pb-16 pt-12 md:pt-16">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/60">
            더 적게, 더 깊이. 하루에 필요한 뉴스만 최소한으로 선별합니다.
            매일 아침, 큐레이션된 다이제스트를 전해드립니다.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4 text-foreground/65">Read</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-foreground/75 transition-colors hover:text-foreground"
              >
                오늘의 다이제스트
              </Link>
            </li>
            <li>
              <Link
                to="/archive"
                className="text-foreground/75 transition-colors hover:text-foreground"
              >
                지난 호 모아보기
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-foreground/65">About</p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-foreground/75">편집 원칙</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-foreground/65 md:flex-row md:items-center md:justify-between">
        <p>© {year} PICKY. All rights reserved.</p>
        <p>Crafted with care · 매일 아침 06:00 KST</p>
      </div>
    </footer>
  );
}
