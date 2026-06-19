import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  TopBar,
  NewsCard,
  ClosingNote,
  TodayQuestion,
  EmptyState,
  Footer,
} from "@/components/news";
import { useDigestIndex } from "@/hooks/use-digest-index";
import { useArchivedDigest } from "@/hooks/use-archived-digest";
import { calculateReadingTime, formatReadingTimeMinutes } from "@/types/news";
import type { DigestIndexEntry } from "@/types/digest";

/** 인덱스(최신순)에서 현재 날짜 기준 이전/다음(시간순) 이웃을 찾는다. */
function findNeighbors(entries: DigestIndexEntry[], date: string) {
  const i = entries.findIndex((e) => e.date === date);
  if (i === -1) return { entry: undefined, newer: undefined, older: undefined };
  // entries는 최신순 → index가 작을수록 더 최신.
  return {
    entry: entries[i],
    newer: i > 0 ? entries[i - 1] : undefined,
    older: i < entries.length - 1 ? entries[i + 1] : undefined,
  };
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <TopBar />
    <div className="mx-auto max-w-prose px-6 md:px-8">{children}</div>
  </div>
);

const BackToArchive = () => (
  <Link
    to="/archive"
    className="group inline-flex items-center gap-1.5 text-sm text-foreground/65 transition-colors hover:text-foreground"
  >
    <ArrowLeft
      className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
      strokeWidth={1.6}
    />
    <span className="border-b border-foreground/20 pb-0.5 transition-colors group-hover:border-foreground">
      지난 호 목록
    </span>
  </Link>
);

const ArchiveDate = () => {
  const { date = "" } = useParams<{ date: string }>();
  const indexState = useDigestIndex();

  const neighbors = useMemo(
    () =>
      indexState.status === "success"
        ? findNeighbors(indexState.index.entries, date)
        : { entry: undefined, newer: undefined, older: undefined },
    [indexState, date],
  );

  // 인덱스에 엔트리가 있으면 그 path를, 없으면 규칙 기반 경로로 폴백한다.
  const indexLoaded = indexState.status !== "loading";
  const path = indexLoaded
    ? neighbors.entry?.path ?? `archive/${date}.json`
    : undefined;

  const digestState = useArchivedDigest(path);

  // 인덱스가 로드됐는데 해당 날짜가 목록에 없음 → 존재하지 않는 날짜.
  const notInIndex =
    indexState.status === "success" && neighbors.entry === undefined;

  const longDate = useMemo(() => {
    try {
      return format(parseISO(date), "yyyy년 M월 d일 EEEE", { locale: ko });
    } catch {
      return date;
    }
  }, [date]);

  if (notInIndex) {
    return (
      <Shell>
        <main className="py-32 text-center">
          <p className="eyebrow text-accent">Not Found</p>
          <h1 className="mt-3 font-serif text-2xl font-bold leading-snug tracking-[-0.02em] md:text-3xl">
            해당 날짜의 다이제스트가 없습니다.
          </h1>
          <p className="mt-4 text-sm text-foreground/65">{date}</p>
          <div className="mt-10">
            <BackToArchive />
          </div>
        </main>
        <Footer />
      </Shell>
    );
  }

  if (digestState.status === "loading" || digestState.status === "idle") {
    return (
      <Shell>
        <main className="py-32 text-center">
          <p className="eyebrow text-foreground/65">Loading</p>
          <p className="mt-3 font-serif text-lg text-foreground/70">
            {longDate} 다이제스트를 불러오는 중입니다…
          </p>
        </main>
      </Shell>
    );
  }

  if (digestState.status === "error") {
    return (
      <Shell>
        <main className="py-32 text-center">
          <p className="eyebrow text-accent">Error</p>
          <h1 className="mt-3 font-serif text-2xl font-bold leading-snug tracking-[-0.02em] md:text-3xl">
            다이제스트를 불러오지 못했습니다.
          </h1>
          <p className="mt-4 text-xs text-foreground/65">
            {digestState.error.message}
          </p>
          <div className="mt-10">
            <BackToArchive />
          </div>
        </main>
        <Footer />
      </Shell>
    );
  }

  const { digest } = digestState;
  const items = digest.items ?? [];
  const hasNews = items.length > 0;
  const question = { date: digest.date, question: digest.question };

  const totalReadingSeconds = items.reduce(
    (sum, item) => sum + calculateReadingTime(item),
    0,
  );

  const { newer, older } = neighbors;

  return (
    <Shell>
      <main>
        <header className="pb-10 pt-12 md:pb-14 md:pt-16">
          <div className="mb-8 flex items-center gap-4 md:mb-10">
            <span className="eyebrow text-accent">Archive</span>
            <span className="h-px flex-1 bg-border" />
            <BackToArchive />
          </div>

          <h1 className="font-serif text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] md:text-[2.75rem]">
            {longDate}
          </h1>

          <div className="mt-8 flex flex-col gap-2 border-t border-rule pt-6 text-sm md:flex-row md:items-center md:justify-between">
            <p className="font-serif text-base font-medium text-foreground/80 md:text-lg">
              그날의 다이제스트
            </p>
            {totalReadingSeconds > 0 && (
              <p className="eyebrow text-foreground/65">
                기사 {items.length}건 · 읽는 데{" "}
                {formatReadingTimeMinutes(totalReadingSeconds)}
              </p>
            )}
          </div>
        </header>

        {hasNews ? (
          <div>
            {items.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {hasNews && <ClosingNote />}
        {hasNews && <TodayQuestion question={question} />}

        {/* 이전/다음 날짜 네비게이션 */}
        <nav className="flex items-stretch justify-between gap-4 border-t border-border py-10">
          {older ? (
            <Link
              to={`/archive/${older.date}`}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="eyebrow inline-flex items-center gap-1 text-foreground/55">
                <ArrowLeft className="h-3 w-3" strokeWidth={1.6} /> 이전 호
              </span>
              <span className="font-serif text-base text-foreground/80 transition-colors group-hover:text-foreground">
                {format(parseISO(older.date), "M월 d일 (EEE)", { locale: ko })}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {newer ? (
            <Link
              to={`/archive/${newer.date}`}
              className="group flex flex-col items-end gap-1 text-right"
            >
              <span className="eyebrow inline-flex items-center gap-1 text-foreground/55">
                다음 호 <ArrowRight className="h-3 w-3" strokeWidth={1.6} />
              </span>
              <span className="font-serif text-base text-foreground/80 transition-colors group-hover:text-foreground">
                {format(parseISO(newer.date), "M월 d일 (EEE)", { locale: ko })}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>

      <Footer />
    </Shell>
  );
};

export default ArchiveDate;
