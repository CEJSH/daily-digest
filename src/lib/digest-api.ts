import type { DailyDigest } from "@/types/digest";

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
    // 중간 캐시 방지(브라우저/프록시)
    cache: "no-store",
  });
  // const res = await fetch(`/daily_digest.json?v=${Date.now()}`, {
  //   cache: "no-store",
  //   signal: options?.signal,
  // });
  if (!res.ok) {
    console.log("dsfsadfasdfasdfasdfasfadsf");
    throw new Error(`Failed to fetch digest: HTTP ${res.status}`);
  }

  const data = await res.json();
  return normalizeDigest(data);
}

function normalizeDigest(d: DailyDigest): DailyDigest {
  // 방어 로직: status draft는 숨김, importance 정렬
  const items = (d.items ?? [])
    .filter((i) => i.status !== "draft")
    .sort((a, b) => (a.importance ?? 99) - (b.importance ?? 99));

  return { ...d, items };
}
