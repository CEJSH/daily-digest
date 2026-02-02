import { useState } from 'react';
import { Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { NewsItem, calculateReadingTime, getCategoryColorClass } from '@/types/news';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export function NewsCard({ news, index }: NewsCardProps) {
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const readingTime = calculateReadingTime(news.summary);

  return (
    <article className="py-6 border-b border-border last:border-b-0">
      {/* 상단: 카테고리 + 읽는 시간 */}
      <div className="flex items-center justify-between mb-3">
        <span 
          className={`${getCategoryColorClass(news.category)} text-white text-xs font-medium px-2 py-0.5 rounded`}
        >
          {news.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {readingTime}초
        </span>
      </div>

      {/* 제목 */}
      <h2 className="font-serif text-lg md:text-xl font-semibold leading-snug mb-3">
        {news.title}
      </h2>

      {/* 3줄 요약 */}
      <ul className="space-y-2 mb-4">
        {news.summary.map((line, i) => (
          <li key={i} className="text-sm text-foreground/90 leading-relaxed pl-4 relative">
            <span className="absolute left-0 text-muted-foreground">•</span>
            {line}
          </li>
        ))}
      </ul>

      {/* 왜 중요한가 */}
      <div className="bg-highlight rounded p-3 mb-3">
        <p className="text-sm">
          <span className="font-medium text-foreground">왜 중요한가:</span>{' '}
          <span className="text-muted-foreground">{news.whyImportant}</span>
        </p>
      </div>

      {/* 원문 보기 (접기/펼치기) */}
      <Collapsible open={isSourceOpen} onOpenChange={setIsSourceOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          원문 보기
          {isSourceOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-2">
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            <ExternalLink className="h-3 w-3" />
            {news.sourceUrl}
          </a>
        </CollapsibleContent>
      </Collapsible>
    </article>
  );
}
