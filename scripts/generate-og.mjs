#!/usr/bin/env node
/**
 * Build-time OG image generator.
 * Reads public/daily_digest.json and renders public/og.png (1200x630)
 * via satori (JSX -> SVG) + @resvg/resvg-js (SVG -> PNG).
 *
 * Run via:   npm run generate:og
 * Hooked to: build / build:dev (prebuild chain)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));

const DIGEST_PATH = join(ROOT, "public", "daily_digest.json");
const OUT_PATH = join(ROOT, "public", "og.png");
const FONT_CACHE_DIR = join(ROOT, "node_modules", ".cache", "og-fonts");
const FONT_CACHE_PATH = join(FONT_CACHE_DIR, "NotoSerifKR-Bold.otf");

// Stable mirror — Google Fonts' direct font binary URL via JSDelivr.
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Serif/SubsetOTF/KR/NotoSerifKR-Bold.otf";

// Tokens mirror src/index.css :root values for visual parity with the app.
const COLORS = {
  background: "#F0F1F2", // hsl(220 12% 95%)
  foreground: "#15171a", // hsl(220 14% 9%)
  subtle: "#5b5d61", // hsl(220 8% 38%)
  accentQuiet: "#4f5970", // hsl(215 22% 38%)
};

async function loadFont() {
  if (existsSync(FONT_CACHE_PATH)) {
    return readFileSync(FONT_CACHE_PATH);
  }
  console.log("→ Fetching Noto Serif KR Bold...");
  const res = await fetch(FONT_URL);
  if (!res.ok) {
    throw new Error(`Font fetch failed: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(FONT_CACHE_DIR, { recursive: true });
  writeFileSync(FONT_CACHE_PATH, buf);
  return buf;
}

function issueNumberFor(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return String(dayOfYear).padStart(3, "0");
}

function buildTree({ headline, volNumber, formattedDate }) {
  // Plain ReactElement-shaped objects — satori accepts this without JSX runtime.
  const div = (style, children) => ({
    type: "div",
    props: { style, children },
  });

  return div(
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: COLORS.background,
      padding: "64px",
      fontFamily: "Noto Serif KR",
      color: COLORS.foreground,
    },
    [
      // Top: wordmark + issue meta
      div(
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        },
        [
          div(
            {
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: COLORS.foreground,
            },
            "Daily Digest",
          ),
          div(
            {
              fontSize: 14,
              fontWeight: 700,
              color: COLORS.subtle,
              letterSpacing: "0.18em",
            },
            `NO.${volNumber} / ${formattedDate}`,
          ),
        ],
      ),
      // Middle: headline
      div(
        {
          flex: 1,
          display: "flex",
          alignItems: "center",
          paddingTop: "40px",
          paddingBottom: "40px",
        },
        [
          div(
            {
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: "-0.022em",
              color: COLORS.foreground,
              wordBreak: "keep-all",
              display: "block",
            },
            headline,
          ),
        ],
      ),
      // Bottom: tagline (spec: 우하단 단일 라인)
      div(
        {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "baseline",
        },
        [
          div(
            {
              fontSize: 18,
              color: COLORS.subtle,
            },
            "Daily Digest · 매일 아침 06:00 KST",
          ),
        ],
      ),
    ],
  );
}

async function main() {
  if (!existsSync(DIGEST_PATH)) {
    throw new Error(`Digest not found at ${DIGEST_PATH}`);
  }

  const digest = JSON.parse(readFileSync(DIGEST_PATH, "utf-8"));
  const volNumber = issueNumberFor(digest.date);
  const formattedDate = String(digest.date).replace(/-/g, ".");
  const headline =
    digest.items?.[0]?.title ?? "오늘 알아야 할 다섯 가지 뉴스";

  const fontData = await loadFont();

  const svg = await satori(
    buildTree({ headline, volNumber, formattedDate }),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Serif KR",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  writeFileSync(OUT_PATH, png);
  console.log(
    `✓ Generated ${OUT_PATH} (vol ${volNumber}, ${formattedDate}, ${png.length} bytes)`,
  );
}

main().catch((err) => {
  console.error("✗ OG generation failed:", err);
  process.exit(1);
});
