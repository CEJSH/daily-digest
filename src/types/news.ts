/**
 * 호환 레이어 — 데이터 모델은 digest.ts(Zod 스키마)가 single source of truth.
 * 이 파일은 컴포넌트가 사용하는 헬퍼 함수와 backward-compat alias만 보유.
 */
export type {
  Category,
  NewsItem,
  NewsSource,
  DailyDigest,
  DailyQuestion,
} from "./digest";

import type { Category, NewsItem } from "./digest";

// Backward-compat alias — 기존 import 경로 보존.
export type NewsCategory = Category;

// 읽는 시간 계산 (한국어 평균 ~500자/분).
// 본문 전체(title + lead + summary + context + whyImportant)를 카운트해
// 카드별 글자 수 변동이 시간에 반영되도록 함. 5초 단위 반올림.
export function calculateReadingTime(item: NewsItem): number {
  const parts: Array<string | undefined> = [
    item.title,
    item.lead,
    ...item.summary,
    item.context,
    item.whyImportant,
  ];
  const totalChars = parts
    .filter((s): s is string => Boolean(s))
    .join("")
    .length;
  const minutes = totalChars / 500;
  const seconds = Math.ceil(minutes * 60);
  return Math.ceil(seconds / 5) * 5;
}

// 카테고리별 색상 클래스
export function getCategoryColorClass(category: Category): string {
  switch (category) {
    case "경제":
      return "bg-category-economy";
    case "산업":
      return "bg-category-industry";
    case "기술":
      return "bg-category-technology";
    case "금융":
      return "bg-category-finance";
    case "정책":
      return "bg-category-policy";
    case "국제":
      return "bg-category-international";
    case "사회":
      return "bg-category-society";
    case "라이프":
      return "bg-category-life";
    case "헬스":
      return "bg-category-health";
    case "환경":
      return "bg-category-environment";
    case "에너지":
      return "bg-category-energy";
    case "모빌리티":
      return "bg-category-mobility";
    default:
      return "bg-muted";
  }
}
