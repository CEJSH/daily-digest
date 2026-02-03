export type NewsCategory = 'IT' | '경제' | '글로벌';

export type NewsStatus = 'draft' | 'published';

export interface NewsItem {
  id: string;
  date: string; // YYYY-MM-DD
  category: NewsCategory;
  title: string;
  summary: string[]; // 3줄 요약
  whyImportant: string; // 왜 중요한가 1줄
  sourceUrl: string;
  status?: NewsStatus; // 운영/자동화 대비
  importance?: 1 | 2 | 3; // 우선순위 (화면 미노출)
}

export interface DailyQuestion {
  date: string; // YYYY-MM-DD
  question: string;
}

export interface NewsMeta {
  lastUpdatedAt: string; // ISO datetime
}

// 읽는 시간 계산 (한국어 평균 읽기 속도 ~500자/분)
export function calculateReadingTime(summary: string[]): number {
  const totalChars = summary.join('').length;
  const minutes = totalChars / 500;
  const seconds = Math.ceil(minutes * 60);
  // 10초 단위 반올림
  return Math.ceil(seconds / 10) * 10;
}

// 카테고리별 색상 클래스
export function getCategoryColorClass(category: NewsCategory): string {
  switch (category) {
    case 'IT':
      return 'bg-category-it';
    case '경제':
      return 'bg-category-economy';
    case '글로벌':
      return 'bg-category-global';
    default:
      return 'bg-muted';
  }
}
