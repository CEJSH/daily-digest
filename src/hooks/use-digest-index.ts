import { useQuery } from "@tanstack/react-query";
import type { DigestIndex } from "@/types/digest";
import { fetchDigestIndex } from "@/lib/digest-api";

type State =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; index: DigestIndex };

/**
 * 아카이브 날짜 목차(data/index.json)를 불러온다.
 * 목차는 자주 바뀌지 않으므로 staleTime을 길게 둔다.
 */
export function useDigestIndex(): State {
  const query = useQuery({
    queryKey: ["digestIndex"],
    queryFn: ({ signal }) => fetchDigestIndex({ signal }),
    staleTime: 30 * 60 * 1000,
  });

  if (query.isPending) return { status: "loading" };
  if (query.isError) {
    const error =
      query.error instanceof Error
        ? query.error
        : new Error(String(query.error));
    return { status: "error", error };
  }
  return { status: "success", index: query.data };
}
