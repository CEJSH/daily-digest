import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Mode = "light" | "dark";

const STORAGE_KEY = "dd.v1.theme";
const LEGACY_STORAGE_KEY = "news-theme-mode";

function readInitialMode(): Mode {
  if (typeof window === "undefined") return "light";
  let stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== "light" && stored !== "dark") {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === "light" || legacy === "dark") {
      stored = legacy;
      try {
        window.localStorage.setItem(STORAGE_KEY, legacy);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        /* private mode may block writes; ignore */
      }
    }
  }
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyMode(mode: Mode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
}

export function ThemeSwitcher() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const initial = readInitialMode();
    setMode(initial);
    applyMode(initial);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "light" ? "dark" : "light";
    setMode(next);
    applyMode(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="group inline-flex h-9 w-9 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
    >
      <Sun
        className={`h-[18px] w-[18px] transition-all ${
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
        strokeWidth={1.6}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
        strokeWidth={1.6}
      />
    </button>
  );
}
