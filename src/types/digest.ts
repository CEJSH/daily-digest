import { z } from "zod";

/**
 * 단일 source of truth — Zod 스키마로 정의된 데이터 모델.
 * TypeScript 타입은 z.infer<>로 도출, 런타임 검증은 동일 스키마로.
 */

// 정규화된 12개 카테고리. 운영 JSON에 잔존하는 레거시 라벨("IT", "글로벌")은
// digest-api.ts의 LEGACY_CATEGORY_MAP을 통해 정규화된다.
export const CategorySchema = z.enum([
  "경제",
  "산업",
  "기술",
  "금융",
  "정책",
  "국제",
  "사회",
  "라이프",
  "헬스",
  "환경",
  "에너지",
  "모빌리티",
]);
export type Category = z.infer<typeof CategorySchema>;

export const NewsSourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
});
export type NewsSource = z.infer<typeof NewsSourceSchema>;

/**
 * 입력 단계 raw 스키마. category는 z.string() 으로 permissive하게 받아
 * 레거시 라벨을 통과시키고, normalizeItem에서 Category enum으로 narrow한다.
 */
export const NewsItemSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  summary: z.array(z.string().min(1)),
  context: z.string().optional(),
  whyImportant: z.string().min(1),
  sourceUrl: z.string(),
  source: NewsSourceSchema.optional(),
  isLead: z.boolean().optional(),
  lead: z.string().optional(),
  // 외부 데이터는 관대하게 받고 내부에서 의미 부여한다.
  // - 'draft'만 숨김 처리되며, 그 외 값('published', 'kept', 미래의 무엇이든)은 노출.
  // - importance는 정렬 키로만 쓰이므로 임의의 숫자 허용.
  status: z.string().optional(),
  importance: z.number().optional(),
  // 레거시/운영 필드 (graceful degradation)
  sourceName: z.string().optional(),
  publishedAt: z.string().optional(),
  readTimeSec: z.number().optional(),
});

/**
 * Zod 검증 직후 raw 형태 (category가 still string).
 * digest-api.ts의 normalizeItem이 이를 NewsItem(strict)으로 변환한다.
 */
export type RawNewsItem = z.infer<typeof NewsItemSchema>;

/**
 * 정규화 후 외부 노출 타입 — category가 strict Category enum으로 좁혀진 형태.
 * 컴포넌트는 항상 이 타입을 통해 데이터를 받는다.
 */
export type NewsItem = Omit<RawNewsItem, "category"> & { category: Category };

export const DailyDigestSchema = z.object({
  date: z.string().min(1),
  selectionCriteria: z.string(),
  question: z.string(),
  lastUpdatedAt: z.string().min(1),
  items: z.array(NewsItemSchema),
});

type RawDailyDigest = z.infer<typeof DailyDigestSchema>;
export type DailyDigest = Omit<RawDailyDigest, "items"> & { items: NewsItem[] };

export type DailyQuestion = {
  date: string;
  question: string;
};

/**
 * 날짜별 아카이브 목차 — 백엔드가 data/index.json으로 제공.
 * entries는 최신순으로 들어오며, path는 data 디렉터리 기준 상대 경로
 * (예: "archive/2026-06-19.json"). count는 그날 기사 수(없을 수 있음).
 */
export const DigestIndexEntrySchema = z.object({
  date: z.string().min(1),
  path: z.string().min(1),
  count: z.number().optional(),
});
export type DigestIndexEntry = z.infer<typeof DigestIndexEntrySchema>;

export const DigestIndexSchema = z.object({
  entries: z.array(DigestIndexEntrySchema),
});
export type DigestIndex = z.infer<typeof DigestIndexSchema>;
