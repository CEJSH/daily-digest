import {
  Header,
  SelectionCriteria,
  EditorNote,
  NewsCard,
  TodayQuestion,
  EmptyState,
  Footer,
} from '@/components/news';
import { sampleNews, sampleQuestion, sampleMeta } from '@/data/sampleNews';

const Index = () => {
  // 실제 운영 시 API/DB에서 가져올 데이터
  const news = sampleNews.filter((n) => n.status === 'published');
  const question = sampleQuestion;
  const meta = sampleMeta;

  const hasNews = news.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 md:px-6">
        {/* 헤더 */}
        <Header lastUpdatedAt={meta.lastUpdatedAt} />

        {/* 선정 기준 토글 */}
        <SelectionCriteria />

        {/* 편집자 주 */}
        <EditorNote />

        {/* 뉴스 카드 목록 또는 Empty State */}
        <main className="py-2">
          {hasNews ? (
            <div>
              {news.map((item, index) => (
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
