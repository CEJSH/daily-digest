import {
  DailyDigestSchema,
  DigestIndexSchema,
  type Category,
  type DailyDigest,
  type DigestIndex,
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
const DIGEST_BASE = import.meta.env.VITE_DIGEST_BASE as string | undefined;

function withCacheBust(url: string) {
  const u = new URL(url);
  u.searchParams.set("v", Date.now().toString()); // 캐시 깨기(가장 확실)
  return u.toString();
}

/**
 * 아카이브 인덱스/날짜별 스냅샷이 위치한 data 디렉터리의 base URL.
 * 명시적으로 VITE_DIGEST_BASE가 있으면 그것을, 없으면 VITE_DIGEST_URL의
 * 파일명을 잘라 data 디렉터리를 도출한다.
 * (예: ".../data/daily_digest.json" → ".../data")
 */
function resolveDigestBase(): string {
  if (DIGEST_BASE) return DIGEST_BASE.replace(/\/+$/, "");
  if (!DIGEST_URL) {
    throw new Error("VITE_DIGEST_URL(또는 VITE_DIGEST_BASE)이 설정되지 않았습니다");
  }
  const u = new URL(DIGEST_URL);
  u.pathname = u.pathname.replace(/\/[^/]*$/, "");
  u.search = "";
  return u.toString().replace(/\/+$/, "");
}

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(withCacheBust(url), { cache: "no-store", signal });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchDailyDigest(options?: {
  signal?: AbortSignal;
}): Promise<DailyDigest> {
  if (!DIGEST_URL) {
    throw new Error("VITE_DIGEST_URL is not set");
  }
  const data = await fetchJson(DIGEST_URL, options?.signal);
  return validateAndNormalize(data);
}

/**
 * 전체 날짜 목차(data/index.json)를 가져온다.
 * 백엔드가 최신순으로 내려주지만, 방어적으로 날짜 내림차순 정렬을 보장한다.
 */
export async function fetchDigestIndex(options?: {
  signal?: AbortSignal;
}): Promise<DigestIndex> {
  const url = `${resolveDigestBase()}/index.json`;
  const data = await fetchJson(url, options?.signal);

  const parsed = DigestIndexSchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      "[digest-api] index.json 검증 실패",
      parsed.error.format(),
    );
    throw new Error("아카이브 목록 형식이 올바르지 않습니다.");
  }

  const entries = [...parsed.data.entries].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return { entries };
}

/**
 * 특정 날짜의 스냅샷을 가져온다. path는 index.json 엔트리의 상대 경로
 * (예: "archive/2026-06-19.json")로, data base URL에 이어붙인다.
 */
export async function fetchArchivedDigest(
  path: string,
  options?: { signal?: AbortSignal },
): Promise<DailyDigest> {
  const url = `${resolveDigestBase()}/${path.replace(/^\/+/, "")}`;
  const data = await fetchJson(url, options?.signal);
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
