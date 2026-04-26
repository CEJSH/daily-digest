import { ArrowUpRight, Clock3 } from "lucide-react";
import {
  NewsItem,
  calculateReadingTime,
  formatReadingTimeMinutes,
  getCategoryColorClass,
} from "@/types/news";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export function NewsCard({ news, index }: NewsCardProps) {
  const readingTime = calculateReadingTime(news);
  const number = String(index + 1).padStart(2, "0");
  const dotClass = getCategoryColorClass(news.category);

  const sourceHref = news.source?.url ?? news.sourceUrl;
  const sourceName = news.source?.name ?? news.sourceName;
  const sourceLabel = sourceName ? `원문 보기 — ${sourceName}` : "원문 보기";

  const isLead = news.isLead === true;

  // Lead는 영구 좌측 보더로 차별화, 비-Lead는 호버 시 슬라이드 affordance.
  // 두 효과는 상호배타 — Lead는 이미 영구 시그널이 있어 호버 추가 불필요.
  const articleAccentClass = isLead
    ? "border-l border-l-accent-quiet pl-3 md:pl-4"
    : "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-px before:-translate-x-1 before:bg-accent-quiet before:opacity-0 before:transition before:duration-150 before:ease-out hover:before:translate-x-0 hover:before:opacity-100 motion-reduce:before:transition-none";

  const headlineSizeClass = isLead
    ? "text-[1.8rem] md:text-[2.5rem]"
    : "text-[1.5rem] md:text-[1.875rem]";

  return (
    <article
      className={`group relative border-b border-border py-10 md:py-14 ${articleAccentClass}`}
    >
      {/* Kicker — 카테고리·읽기시간 가로 한 줄, 헤드라인 위에 위치 */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 leading-none">
        <span className="inline-flex items-center gap-1.5">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass}`}
            aria-hidden
          />
          <span className="eyebrow text-foreground/70">
            {news.category}
          </span>
        </span>
        <span aria-hidden className="text-foreground/30">·</span>
        <span className="inline-flex items-center gap-1 text-xs text-foreground/65">
          <Clock3 className="h-3 w-3" strokeWidth={1.5} />
          {formatReadingTimeMinutes(readingTime)}
        </span>
      </div>

      {/* 헤드라인 — 챕터 번호를 인라인 span으로 결합. 와이드 모니터에서
          좌측 레일에 격리되어 보이는 분리감을 제거하고, 의미상 '장 번호 +
          제목'을 한 묶음으로 읽히게 한다. aria-hidden으로 SR에는 미노출. */}
      <h2
        className={`mt-4 font-serif font-bold leading-[1.2] tracking-[-0.02em] ${headlineSizeClass}`}
      >
        <span className="mr-3 text-accent" aria-hidden>
          {number}
        </span>
        {news.title}
      </h2>

      <div className="mt-6 space-y-6">
        {isLead && news.lead && (
          <p className="font-serif text-base leading-relaxed text-foreground/65 md:text-lg">
            {news.lead}
          </p>
        )}

        <ul className="space-y-3">
          {news.summary.map((line, i) => (
            <li
              key={i}
              className="relative pl-5 text-[0.975rem] leading-[1.75] text-foreground/85 md:text-base"
            >
              <span
                className="absolute left-0 top-[0.85em] h-px w-3 bg-foreground/30"
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>

        {news.context && (
          <p className="text-sm leading-relaxed text-foreground/65">
            {news.context}
          </p>
        )}

        <div className="border-l-4 border-accent bg-callout-bg p-5 md:p-6">
          <p className="eyebrow mb-2 text-accent">왜 중요한가</p>
          <p className="text-[0.975rem] leading-[1.7] text-foreground/85 md:text-base">
            {news.whyImportant}
          </p>
        </div>

        <a
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-1.5 text-sm text-foreground/70 transition-colors hover:text-foreground"
        >
          <span className="border-b border-foreground/30 pb-0.5 transition-colors group-visited/link:border-rule/40 group-hover/link:border-foreground">
            {sourceLabel}
          </span>
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            strokeWidth={1.6}
          />
          <span className="sr-only">(새 창에서 열림)</span>
        </a>
      </div>
    </article>
  );
}
