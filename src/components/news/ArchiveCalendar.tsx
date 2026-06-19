import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { DigestIndexEntry } from "@/types/digest";

interface ArchiveCalendarProps {
  /** 최신순으로 정렬된 날짜 엔트리. */
  entries: DigestIndexEntry[];
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** YYYY-MM 비교용 키. */
function monthKey(d: Date): string {
  return format(d, "yyyy-MM");
}

export function ArchiveCalendar({ entries }: ArchiveCalendarProps) {
  // 날짜 → 엔트리 조회 맵.
  const byDate = useMemo(() => {
    const m = new Map<string, DigestIndexEntry>();
    for (const e of entries) m.set(e.date, e);
    return m;
  }, [entries]);

  // 엔트리는 최신순 → [0]이 가장 최신, [last]가 가장 오래됨.
  const latestMonth = useMemo(
    () => startOfMonth(parseISO(entries[0].date)),
    [entries],
  );
  const earliestMonth = useMemo(
    () => startOfMonth(parseISO(entries[entries.length - 1].date)),
    [entries],
  );

  const [cursor, setCursor] = useState<Date>(latestMonth);

  const canPrev = monthKey(cursor) > monthKey(earliestMonth);
  const canNext = monthKey(cursor) < monthKey(latestMonth);

  const { cells, monthLabel } = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const leading = getDay(monthStart); // 0=일요일

    const blanks: Array<null> = Array.from({ length: leading }, () => null);
    return {
      cells: [...blanks, ...days],
      monthLabel: format(cursor, "yyyy년 M월", { locale: ko }),
    };
  }, [cursor]);

  return (
    <div>
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canPrev && setCursor((c) => subMonths(c, 1))}
          disabled={!canPrev}
          aria-label="이전 달"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-callout-bg hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </button>
        <h2 className="font-serif text-xl font-bold tracking-[-0.02em] md:text-2xl">
          {monthLabel}
        </h2>
        <button
          type="button"
          onClick={() => canNext && setCursor((c) => addMonths(c, 1))}
          disabled={!canNext}
          aria-label="다음 달"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-callout-bg hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mt-6 grid grid-cols-7 gap-1 border-b border-border pb-2">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center text-[0.6875rem] font-medium tracking-[0.08em] text-foreground/45"
          >
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} aria-hidden />;

          const inMonth = isSameMonth(day, cursor);
          const dateStr = format(day, "yyyy-MM-dd");
          const entry = inMonth ? byDate.get(dateStr) : undefined;
          const dayNum = format(day, "d");

          if (!entry) {
            return (
              <div
                key={dateStr}
                className="flex aspect-square flex-col items-center justify-center rounded-md text-sm text-foreground/25"
              >
                {dayNum}
              </div>
            );
          }

          return (
            <Link
              key={dateStr}
              to={`/archive/${entry.date}`}
              aria-label={`${format(day, "M월 d일", { locale: ko })} 다이제스트${
                typeof entry.count === "number" ? ` 기사 ${entry.count}건` : ""
              }`}
              className="group flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md border border-transparent bg-callout-bg/50 transition-colors hover:border-accent/40 hover:bg-callout-bg"
            >
              <span className="font-serif text-base font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                {dayNum}
              </span>
              {typeof entry.count === "number" && (
                <span className="text-[0.625rem] leading-none text-accent">
                  {entry.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 범례 */}
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.6875rem] text-foreground/45">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-callout-bg/50 ring-1 ring-inset ring-border" />
        발행된 날 · 숫자는 기사 수
      </p>
    </div>
  );
}
