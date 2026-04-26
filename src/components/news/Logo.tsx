/**
 * PICKY 브랜드 마크 + 워드마크.
 *
 * 마크는 4개 막대 중 하나만 액센트로 강조 — '많은 것 중 하나만 고른다'는
 * 큐레이션 컨셉을 시각화. 워드마크는 sans bold + tracking-tight.
 *
 * 다크 모드 대응을 SVG 내부에서 처리하므로 외부에서 색상을 따로
 * 신경 쓰지 않아도 된다.
 */

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "full" | "icon" | "wordmark";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

const SIZE_MAP: Record<LogoSize, { svg: number; text: string; gap: string }> = {
  sm: { svg: 20, text: "text-base", gap: "gap-1.5" },
  md: { svg: 24, text: "text-lg", gap: "gap-2" },
  lg: { svg: 32, text: "text-2xl", gap: "gap-2.5" },
  xl: { svg: 48, text: "text-4xl", gap: "gap-3" },
};

export function Logo({
  size = "md",
  variant = "full",
  className = "",
}: LogoProps) {
  const { svg, text, gap } = SIZE_MAP[size];
  const iconOnly = variant === "icon";

  const Icon = (
    <svg
      width={svg}
      height={svg}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={iconOnly ? "img" : undefined}
      aria-label={iconOnly ? "PICKY" : undefined}
      aria-hidden={iconOnly ? undefined : true}
    >
      <rect
        x="10"
        y="8"
        width="28"
        height="6"
        rx="2"
        className="fill-gray-200 dark:fill-gray-700"
      />
      <rect
        x="10"
        y="18"
        width="28"
        height="6"
        rx="2"
        className="fill-blue-600 dark:fill-blue-500"
      />
      <rect
        x="10"
        y="28"
        width="28"
        height="6"
        rx="2"
        className="fill-gray-200 dark:fill-gray-700"
      />
      <rect
        x="10"
        y="38"
        width="20"
        height="4"
        rx="2"
        className="fill-gray-200 dark:fill-gray-700"
      />
    </svg>
  );

  const Wordmark = (
    <span
      className={`font-sans font-bold tracking-tight text-foreground dark:text-white ${text}`}
    >
      PICKY
    </span>
  );

  return (
    <span className={`inline-flex items-center ${gap} ${className}`}>
      {variant !== "wordmark" && Icon}
      {variant !== "icon" && Wordmark}
    </span>
  );
}
