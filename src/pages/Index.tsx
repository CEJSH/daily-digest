import {
  TopBar,
  Header,
  SelectionCriteria,
  EditorNote,
  NewsCard,
  ClosingNote,
  TodayQuestion,
  SubscribeForm,
  EmptyState,
  Footer,
} from "@/components/news";
import { useDailyDigest } from "@/hooks/use-daily-digest";
import { calculateReadingTime } from "@/types/news";

const Index = () => {
  const state = useDailyDigest();

  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="mx-auto max-w-prose px-6 py-32 text-center md:px-8">
          <p className="eyebrow text-foreground/65">Loading</p>
          <p className="mt-3 font-serif text-lg text-foreground/70">
            오늘의 다이제스트를 불러오는 중입니다…
          </p>
        </main>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="mx-auto max-w-prose px-6 py-32 text-center md:px-8">
          <p className="eyebrow text-accent">No Issue</p>
          <h1 className="mt-3 font-serif text-2xl font-bold leading-snug tracking-[-0.02em] text-foreground md:text-3xl">
            오늘은 쉬어가는 날입니다.
          </h1>
          <p className="mt-4 text-base text-foreground/65">
            내일 아침에 다시 정리해 전해드리겠습니다.
          </p>
          <p className="mt-8 text-xs text-foreground/65">
            {state.error.message}
          </p>
        </main>
      </div>
    );
  }

  const { digest } = state;
  const items = digest.items ?? [];
  const hasNews = items.length > 0;
  const question = { date: digest.date, question: digest.question };

  const categoryCountMap = new Map<string, number>();
  for (const item of items) {
    categoryCountMap.set(
      item.category,
      (categoryCountMap.get(item.category) ?? 0) + 1,
    );
  }
  const categoryCounts = Array.from(categoryCountMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const totalReadingSeconds = items.reduce(
    (sum, item) => sum + calculateReadingTime(item),
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <div className="mx-auto max-w-prose px-6 md:px-8">
        <main>
          <Header
            lastUpdatedAt={digest.lastUpdatedAt}
            categoryCounts={categoryCounts}
            totalReadingSeconds={totalReadingSeconds}
          />
          <SelectionCriteria />
          <EditorNote />

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
          <SubscribeForm />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
