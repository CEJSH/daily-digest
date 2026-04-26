import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SELECTION_CRITERIA = [
  {
    label: "01",
    title: "내일도 영향을 미칠 이슈",
    description:
      "오늘만 휘발되는 뉴스가 아닌, 앞으로의 판단에 영향을 줄 소식만 다룹니다.",
  },
  {
    label: "02",
    title: "감정 소모를 자극하는 보도 제외",
    description:
      "불안과 분노를 유발하기 위한 자극적인 헤드라인은 다루지 않습니다.",
  },
  {
    label: "03",
    title: "어제와 중복되는 이슈 제외",
    description:
      "새로운 정보가 없는 반복 보도는 건너뜁니다. 의미 있는 변화만 전합니다.",
  },
];

const STORAGE_KEY = "dd.v1.editorialPrinciples.collapsed";
const LEGACY_STORAGE_KEY = "dd.editorialPrinciples.collapsed";
const MOBILE_PREVIEW = "내일도 영향을 미칠 이슈 · 감정 자극 제외 · 중복 제외";

function readInitialOpenState(): boolean {
  if (typeof window === "undefined") return true;
  let stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== "true" && stored !== "false") {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === "true" || legacy === "false") {
      stored = legacy;
      try {
        window.localStorage.setItem(STORAGE_KEY, legacy);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        /* private mode may block writes; ignore */
      }
    }
  }
  if (stored === "true") return false;
  if (stored === "false") return true;
  return window.matchMedia("(min-width: 640px)").matches;
}

export function SelectionCriteria() {
  const [isOpen, setIsOpen] = useState<boolean>(readInitialOpenState);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(!open));
    }
  };

  return (
    <section className="border-y border-border">
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger className="flex w-full items-start justify-between py-4 text-left">
          <span className="flex flex-col gap-1.5">
            <span className="eyebrow text-foreground/65 transition-colors group-hover:text-foreground">
              편집 원칙
            </span>
            {!isOpen && (
              <span className="text-xs leading-relaxed text-foreground/55 sm:hidden">
                {MOBILE_PREVIEW}
              </span>
            )}
          </span>
          <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center text-foreground/50">
            <Plus
              className={`absolute h-4 w-4 transition-all duration-150 ease-out motion-reduce:transition-none ${
                isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
              strokeWidth={1.5}
            />
            <Minus
              className={`absolute h-4 w-4 transition-all duration-150 ease-out motion-reduce:transition-none ${
                isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              }`}
              strokeWidth={1.5}
            />
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {SELECTION_CRITERIA.map((c) => (
              <div
                key={c.label}
                className="bg-background px-1 py-6 first:pl-0 md:px-6 md:first:pl-6"
              >
                <p className="eyebrow mb-3 text-accent">{c.label}</p>
                <p className="font-serif text-base font-bold leading-snug tracking-[-0.01em] text-foreground">
                  {c.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
