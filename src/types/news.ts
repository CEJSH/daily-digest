export type NewsCategory =
  | '경제'
  | '산업'
  | '기술'
  | '금융'
  | '정책'
  | '국제'
  | '사회'
  | '라이프'
  | '헬스'
  | '환경'
  | '에너지'
  | '모빌리티';

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
    case '경제':
      return 'bg-category-economy';
    case '산업':
      return 'bg-category-industry';
    case '기술':
      return 'bg-category-technology';
    case '금융':
      return 'bg-category-finance';
    case '정책':
      return 'bg-category-policy';
    case '국제':
      return 'bg-category-international';
    case '사회':
      return 'bg-category-society';
    case '라이프':
      return 'bg-category-life';
    case '헬스':
      return 'bg-category-health';
    case '환경':
      return 'bg-category-environment';
    case '에너지':
      return 'bg-category-energy';
    case '모빌리티':
      return 'bg-category-mobility';
    default:
      return 'bg-muted';
  }
}
