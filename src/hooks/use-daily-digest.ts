import { useEffect, useState } from "react";
import type { DailyDigest } from "@/types/digest";
import { fetchDailyDigest } from "@/lib/digest-api";

type State =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; digest: DailyDigest };

export function useDailyDigest() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const digest = await fetchDailyDigest({ signal: controller.signal });
        if (!mounted) return;

        // Empty 조건: items가 5개 미만이면 empty 처리해도 됨
        setState({ status: "success", digest });
      } catch (e) {
        if (!mounted) return;
        if (controller.signal.aborted) return;
        const error = e instanceof Error ? e : new Error(String(e));
        setState({ status: "error", error });
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return state;
}
