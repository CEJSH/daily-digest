import {
  DailyDigestSchema,
  type Category,
  type DailyDigest,
  type NewsItem,
  type RawNewsItem,
} from "@/types/digest";

/**
 * 운영 JSON에 잔존하는 구 카테고리 라벨 → 신규 12개 분류 매핑.
 * 업스트림 데이터가 마이그레이션될 때까지의 방어 계층이며,
 * 정렬 후 깔끔히 제거 가능하도록 한 곳에 모아둔다.
 */
const LEGACY_CATEGORY_MAP: Partial<Record<string, Category>> = {
  IT: "기술",
  글로벌: "국제",
};

const DIGEST_URL = import.meta.env.VITE_DIGEST_URL as string | undefined;

function withCacheBust(url: string) {
  const u = new URL(url);
  u.searchParams.set("v", Date.now().toString()); // 캐시 깨기(가장 확실)
  return u.toString();
}

export async function fetchDailyDigest(options?: {
  signal?: AbortSignal;
}): Promise<DailyDigest> {
  if (!DIGEST_URL) {
    throw new Error("VITE_DIGEST_URL is not set");
  }

  const res = await fetch(withCacheBust(DIGEST_URL), {
    cache: "no-store",
    signal: options?.signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch digest: HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  return validateAndNormalize(data);
}

/**
 * 1) Zod 스키마로 incoming JSON 검증
 * 2) 실패 시 콘솔에 상세 path/메시지 출력 + 사용자용 에러 throw
 * 3) 성공 시 정규화(레거시 매핑 + status 필터 + importance 정렬)
 */
function validateAndNormalize(data: unknown): DailyDigest {
  const parsed = DailyDigestSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 5)
      .map((i) => `  • ${i.path.join(".") || "<root>"}: ${i.message}`)
      .join("\n");
    console.error(
      `[digest-api] Schema validation failed:\n${issues}`,
      parsed.error.format(),
    );
    const first = parsed.error.issues[0];
    const where = first?.path.join(".") || "최상위";
    throw new Error(
      `다이제스트 형식이 올바르지 않습니다 (${where}: ${first?.message}).`,
    );
  }

  const items = parsed.data.items
    .filter((i) => i.status !== "draft")
    .map(normalizeItem)
    .sort((a, b) => (b.importance ?? 99) - (a.importance ?? 99));

  return { ...parsed.data, items };
}

function normalizeItem(item: RawNewsItem): NewsItem {
  const mappedCategory =
    LEGACY_CATEGORY_MAP[item.category] ?? (item.category as Category);
  return {
    ...item,
    category: mappedCategory,
    source:
      item.source ??
      (item.sourceName
        ? { name: item.sourceName, url: item.sourceUrl }
        : undefined),
  };
}
