export type Category =
  | "경제"
  | "산업"
  | "기술"
  | "금융"
  | "정책"
  | "국제"
  | "사회"
  | "라이프"
  | "헬스"
  | "환경"
  | "에너지"
  | "모빌리티";

export type NewsItem = {
  id: string;
  date: string;
  category: Category;
  title: string;
  summary: string[]; // 기획서대로 배열
  whyImportant: string;
  sourceUrl: string;

  // 미래 대비(있어도 되고 없어도 됨)
  status?: "draft" | "published";
  importance?: 1 | 2 | 3;

  // 부가(있으면 사용)
  sourceName?: string;
  publishedAt?: string;
  readTimeSec?: number;
};

export type DailyDigest = {
  date: string;
  selectionCriteria: string;
  question: string;
  lastUpdatedAt: string;
  items: NewsItem[];
};
