import { useMemo } from "react";
import { format } from "date-fns";
import { ko } from 'date-fns/locale';
import { SubscribeCTA } from './SubscribeCTA';
import { ThemeSwitcher } from './ThemeSwitcher';
import { formatReadingTimeMinutes } from '@/types/news';

interface HeaderProps {
  lastUpdatedAt: string;
  /**
   * 헤드라인 강조 범위. "phrase"는 "다섯 가지" 전체, "word"는 "다섯"만.
   * 기본값은 기존 동작 유지를 위해 "phrase".
   */
  emphasisScope?: "phrase" | "word";
  /**
   * 이번 호의 카테고리 분포. 카운트 내림차순 정렬되어 들어옴.
   * 비어 있으면 메타 라인 미노출.
   */
  categoryCounts?: Array<{ category: string; count: number }>;
  /**
   * 이번 호 전체 읽기 시간(초). 마스트헤드 하단에 "한 호 읽는 데
   * 약 N분"으로 표기. 0 또는 미전달 시 미노출.
   */
  totalReadingSeconds?: number;
}

function issueNumberFor(date: Date): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return String(dayOfYear).padStart(3, "0");
}

export function Header({
  lastUpdatedAt,
  emphasisScope = "phrase",
  categoryCounts,
  totalReadingSeconds,
}: HeaderProps) {
  const { longDate, updatedTime, updatedDay, issueNo, yearLine } = useMemo(() => {
    const today = new Date();
    const updatedDate = new Date(lastUpdatedAt);
    return {
      longDate: format(today, "yyyy년 M월 d일 EEEE", { locale: ko }),
      updatedTime: format(updatedDate, "HH:mm"),
      updatedDay: format(updatedDate, "yyyy.MM.dd"),
      issueNo: issueNumberFor(today),
      yearLine: format(today, "'Vol.' yyyy"),
    };
  }, [lastUpdatedAt]);

  return (
    <header className="pb-10 pt-12 md:pb-14 md:pt-16">
      <div className="mb-8 flex items-center gap-4 md:mb-10">
        <span className="eyebrow text-accent">No. {issueNo}</span>
        <span className="h-px flex-1 bg-border" />
        <span className="eyebrow text-foreground/50">{yearLine}</span>
      </div>

      <h1 className="font-serif text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[3.25rem] lg:text-[3.75rem]">
        오늘 알아야 할<wbr /> <br className="hidden sm:block" />
        {emphasisScope === "word" ? (
          <>
            <span className="text-accent-quiet">다섯</span> 가지 뉴스.
          </>
        ) : (
          <>
            <span className="text-accent-quiet">다섯 가지</span> 뉴스.
          </>
        )}
      </h1>

      <div className="mt-8 flex flex-col gap-2 border-t border-rule pt-6 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-base font-medium text-foreground/80 md:text-lg">
          {longDate}
        </p>
        <p className="eyebrow text-foreground/45">
          Updated {updatedDay} · {updatedTime}
        </p>
      </div>

      {categoryCounts && categoryCounts.length > 0 && (
        <p className="mt-3 text-xs text-foreground/55 md:text-right">
          오늘의 비중 —{" "}
          {categoryCounts
            .map(({ category, count }) => `${category} ${count}`)
            .join(" · ")}
        </p>
      )}

      {typeof totalReadingSeconds === "number" && totalReadingSeconds > 0 && (
        <p className="mt-2 text-xs text-foreground/55 md:text-right">
          한 호 읽는 데 {formatReadingTimeMinutes(totalReadingSeconds)}
        </p>
      )}

      <div className="mt-8">
        <SubscribeCTA />
      </div>
    </header>
  );
}
