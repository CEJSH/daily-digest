import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, List } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { TopBar, Footer, ArchiveCalendar } from "@/components/news";
import { useDigestIndex } from "@/hooks/use-digest-index";
import type { DigestIndexEntry } from "@/types/digest";

type ViewMode = "calendar" | "list";

type MonthGroup = {
  key: string; // "2026-06"
  label: string; // "2026년 6월"
  entries: DigestIndexEntry[];
};

/** 날짜 엔트리를 연-월 단위로 묶는다. 입력은 최신순 정렬을 가정. */
function groupByMonth(entries: DigestIndexEntry[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  const indexByKey = new Map<string, number>();

  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    let idx = indexByKey.get(key);
    if (idx === undefined) {
      idx = groups.length;
      indexByKey.set(key, idx);
      groups.push({
        key,
        label: format(parseISO(`${key}-01`), "yyyy년 M월", { locale: ko }),
        entries: [],
      });
    }
    groups[idx].entries.push(entry);
  }

  return groups;
}

const BackToToday = () => (
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
);

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}

const ViewToggle = ({ mode, onChange }: ViewToggleProps) => {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.06em] transition-colors";
  return (
    <div
      role="group"
      aria-label="보기 방식"
      className="inline-flex items-center gap-1 rounded-full border border-border p-0.5"
    >
      <button
        type="button"
        onClick={() => onChange("calendar")}
        aria-pressed={mode === "calendar"}
        className={`${base} ${
          mode === "calendar"
            ? "bg-foreground text-background"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.7} />
        달력
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={mode === "list"}
        className={`${base} ${
          mode === "list"
            ? "bg-foreground text-background"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        <List className="h-3.5 w-3.5" strokeWidth={1.7} />
        목록
      </button>
    </div>
  );
};

const Archive = () => {
  const state = useDigestIndex();
  const [mode, setMode] = useState<ViewMode>("calendar");

  // query.data 참조는 안정적이므로 index를 기준으로 메모이즈해
  // 매 렌더마다 새 배열이 생기는 것을 막는다.
  const index = state.status === "success" ? state.index : null;
  const entries = useMemo(() => index?.entries ?? [], [index]);
  const months = useMemo(() => groupByMonth(entries), [entries]);
  const totalDays = entries.length;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <div className="mx-auto max-w-prose px-6 md:px-8">
        <main>
          <header className="pb-10 pt-12 md:pb-12 md:pt-16">
            <p className="eyebrow text-accent">Archive</p>
            <h1 className="mt-4 font-serif text-[2.25rem] font-bold leading-[1.1] tracking-[-0.03em] md:text-[3rem]">
              지난 호 모아보기
            </h1>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-foreground/65 md:text-[1.0625rem]">
              {totalDays > 0
                ? `지금까지 ${totalDays}일치 다이제스트가 쌓였습니다. 원하는 날짜를 골라 그날의 뉴스를 다시 읽어보세요.`
                : "과거 다이제스트를 날짜별로 다시 읽어볼 수 있습니다."}
            </p>
          </header>

          {state.status === "loading" && (
            <section className="border-t border-border py-20 text-center">
              <p className="eyebrow text-foreground/65">Loading</p>
              <p className="mt-3 font-serif text-lg text-foreground/70">
                아카이브 목록을 불러오는 중입니다…
              </p>
            </section>
          )}

          {state.status === "error" && (
            <section className="border-t border-border py-20 text-center">
              <p className="eyebrow text-accent">Error</p>
              <p className="mt-3 font-serif text-lg text-foreground/70">
                아카이브 목록을 불러오지 못했습니다.
              </p>
              <p className="mt-4 text-xs text-foreground/65">
                {state.error.message}
              </p>
              <BackToToday />
            </section>
          )}

          {state.status === "success" && totalDays === 0 && (
            <section className="border-t border-border py-20 text-center">
              <p className="eyebrow text-foreground/65">Empty</p>
              <p className="mt-3 font-serif text-lg text-foreground/70">
                아직 아카이브된 다이제스트가 없습니다.
              </p>
              <BackToToday />
            </section>
          )}

          {state.status === "success" && totalDays > 0 && (
            <>
              <div className="flex items-center justify-between border-t border-border pt-6">
                <span className="eyebrow text-foreground/55">
                  {mode === "calendar" ? "Calendar" : "List"}
                </span>
                <ViewToggle mode={mode} onChange={setMode} />
              </div>

              {mode === "calendar" ? (
                <section className="pt-8">
                  <ArchiveCalendar entries={entries} />
                </section>
              ) : (
                <section className="pt-2">
                  {months.map((month) => (
                    <div key={month.key} className="py-8">
                      <h2 className="eyebrow sticky top-[57px] z-10 -mx-6 bg-background/90 px-6 py-2 text-foreground/55 backdrop-blur-sm md:-mx-8 md:px-8">
                        {month.label}
                      </h2>
                      <ul className="mt-2">
                        {month.entries.map((entry) => (
                          <li key={entry.date}>
                            <Link
                              to={`/archive/${entry.date}`}
                              className="group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:bg-callout-bg/40"
                            >
                              <span className="flex items-baseline gap-3">
                                <span className="font-serif text-lg text-foreground/90 transition-colors group-hover:text-foreground md:text-xl">
                                  {format(parseISO(entry.date), "M월 d일 (EEE)", {
                                    locale: ko,
                                  })}
                                </span>
                                <ArrowUpRight
                                  aria-hidden
                                  className="h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                  strokeWidth={1.8}
                                />
                              </span>
                              {typeof entry.count === "number" && (
                                <span className="shrink-0 text-xs text-foreground/55">
                                  기사 {entry.count}건
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              <BackToToday />
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Archive;
