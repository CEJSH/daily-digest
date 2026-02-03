export type Category = "IT" | "경제" | "글로벌";

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
