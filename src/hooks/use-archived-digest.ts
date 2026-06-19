import { useQuery } from "@tanstack/react-query";
import type { DailyDigest } from "@/types/digest";
import { fetchArchivedDigest } from "@/lib/digest-api";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; digest: DailyDigest };

/**
 * 특정 날짜 스냅샷을 불러온다. path가 없으면(아직 목차 미로딩 등) idle.
 * 과거 스냅샷은 불변이므로 무기한 캐시한다.
 */
export function useArchivedDigest(path: string | undefined): State {
  const query = useQuery({
    queryKey: ["archivedDigest", path],
    queryFn: ({ signal }) => fetchArchivedDigest(path as string, { signal }),
    enabled: Boolean(path),
    staleTime: Infinity,
  });

  if (!path) return { status: "idle" };
  if (query.isPending) return { status: "loading" };
  if (query.isError) {
    const error =
      query.error instanceof Error
        ? query.error
        : new Error(String(query.error));
    return { status: "error", error };
  }
  return { status: "success", digest: query.data };
}
