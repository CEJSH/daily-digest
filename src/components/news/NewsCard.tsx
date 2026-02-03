import { useState } from "react";
import { Clock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import {
  NewsItem,
  calculateReadingTime,
  getCategoryColorClass,
} from "@/types/news";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export function NewsCard({ news, index }: NewsCardProps) {
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const readingTime = calculateReadingTime(news.summary);

  return (
    <article className="py-8 md:py-10 border-b border-border last:border-b-0">
      {/* 상단: 카테고리 + 읽는 시간 */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`${getCategoryColorClass(news.category)} text-white text-xs font-semibold px-2.5 py-1 rounded`}
        >
          {news.category}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {readingTime}초
        </span>
      </div>

      {/* 제목 - 더 크고 명확하게 */}
      <h2 className="font-serif text-xl md:text-2xl font-bold leading-snug mb-5 tracking-tight">
        {news.title}
      </h2>

      {/* 3줄 요약 - 넉넉한 행간 */}
      <ul className="space-y-3 mb-6">
        {news.summary.map((line, i) => (
          <li
            key={i}
            className="text-base text-foreground/85 leading-relaxed pl-5 relative"
          >
            <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            {line}
          </li>
        ))}
      </ul>

      {/* 왜 중요한가 - 시각적 구분 강화 */}
      <div className="bg-highlight border-l-4 border-foreground/20 rounded-r px-4 py-3 mb-4">
        <p className="text-base leading-relaxed">
          <span className="font-semibold text-foreground">왜 중요한가</span>
          <span className="mx-2 text-muted-foreground/50">—</span>
          <span className="text-foreground/75">{news.whyImportant}</span>
        </p>
      </div>

      {/* 원문 보기 */}
      <Collapsible open={isSourceOpen} onOpenChange={setIsSourceOpen}>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          원문 보기
          {isSourceOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-3">
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            원문 기사로 이동
          </a>
        </CollapsibleContent>
      </Collapsible>
    </article>
  );
}
