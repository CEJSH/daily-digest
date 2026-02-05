import {
  Header,
  SelectionCriteria,
  EditorNote,
  NewsCard,
  TodayQuestion,
  EmptyState,
  Footer,
} from "@/components/news";
import { useDailyDigest } from "@/hooks/use-daily-digest";

const Index = () => {
  const state = useDailyDigest();

  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 md:px-6 py-20 text-center text-muted-foreground">
          불러오는 중…
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 md:px-6 py-20 text-center">
          <p className="text-foreground mb-2">
            오늘은 쉬어가는 날입니다. 내일 아침에 다시 정리해드릴게요.
          </p>
          <small className="text-muted-foreground/70">
            {state.error.message}
          </small>
        </div>
      </div>
    );
  }

  const { digest } = state;
  const items = [...(digest.items ?? [])].sort(
    (a, b) => (b.importance ?? 99) - (a.importance ?? 99),
  );
  const hasNews = items.length > 0;
  const question = { date: digest.date, question: digest.question };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 md:px-6">
        {/* 헤더 */}
        <Header lastUpdatedAt={digest.lastUpdatedAt} />

        {/* 선정 기준 토글 */}
        <SelectionCriteria />

        {/* 편집자 주 */}
        <EditorNote />

        {/* 뉴스 카드 목록 또는 Empty State */}
        <main className="py-2">
          {hasNews ? (
            <div>
              {items.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>

        {/* 오늘의 질문 */}
        {hasNews && <TodayQuestion question={question} />}

        {/* 푸터 */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
