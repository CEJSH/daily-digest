import { useQuery } from "@tanstack/react-query";
import type { DailyDigest } from "@/types/digest";
import { fetchDailyDigest } from "@/lib/digest-api";

type State =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; digest: DailyDigest };

export function useDailyDigest(): State {
  const query = useQuery({
    queryKey: ["dailyDigest"],
    queryFn: ({ signal }) => fetchDailyDigest({ signal }),
  });

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
