# PICKY — Daily News Digest Frontend

하루에 필요한 뉴스만 최대 20건으로 추려 보여주는 일간 뉴스 다이제스트의 프론트엔드입니다.
백엔드 파이프라인이 발행한 정적 JSON을 런타임에 가져와 렌더링하며, 서버 없이 정적 호스팅만으로 운영됩니다.

- 배포: [daily-digest-eta.vercel.app](https://daily-digest-eta.vercel.app)
- 데이터 파이프라인: [daily-news-digest](https://github.com/CEJSH/daily-news-digest)

> 초기 스캐폴드는 Lovable로 생성했습니다. 이후 데이터 계층을 TanStack Query 기반으로 전환하고,
> Zod 스키마 검증·캐시 전략·빌드 타임 OG 생성·접근성 대응을 직접 설계해 구현했습니다.

---

## 기능

- **오늘의 다이제스트** (`/`) — 최신 호, 카테고리별 기사 비중, 호 전체 읽기 시간
- **아카이브** (`/archive`, `/archive/:date`) — 날짜별 지난 호 조회
- 기사별 3줄 요약, "왜 중요한가" 콜아웃, 예상 읽기 시간, 원문 링크
- 라이트/다크 테마 전환
- 대표 기사 기준 OG 이미지 빌드 타임 생성

## 기술 스택

Vite · React 18 · TypeScript · React Router · TanStack Query · Tailwind CSS · shadcn/ui · Zod · Vitest · Satori + Resvg

---

## 설계하면서 다룬 문제들

**외부 JSON을 신뢰하지 않는 데이터 계층**

데이터를 별도 저장소의 파이프라인이 발행하기 때문에, 프론트엔드 입장에서는 언제든 형식이 바뀔 수 있는 외부 입력입니다. Zod 스키마로 런타임 검증을 두되, 처음의 엄격한 스키마는 백엔드가 필드 하나만 바꿔도 화면 전체가 죽는 문제를 만들었습니다. 화면 렌더링에 반드시 필요한 필드와 없어도 되는 필드를 구분해 `status`·`importance` 같은 항목은 permissive하게 완화했고, 과거 데이터의 레거시 카테고리 라벨(`IT`, `글로벌`)은 프론트에서 현재 체계(`기술`, `국제`)로 정규화해 흡수합니다.

**데이터 성격에 따라 캐시 정책 분리**

최신 호와 과거 호는 성격이 다릅니다. 최신 호는 발행 주기마다 갱신되므로 cache bust 쿼리와 `cache: "no-store"`로 항상 최신을 가져오고, 과거 날짜 스냅샷은 다시 바뀔 일이 없는 불변 데이터이므로 TanStack Query에서 무기한 캐시합니다. 같은 fetch 레이어를 쓰면서 요청 대상에 따라 정책만 갈라지는 구조로 정리했습니다.

**서버 없이 공유 카드 해결하기**

정적 호스팅이라 SSR로 OG 태그를 그릴 수 없었습니다. Satori와 Resvg로 빌드 시점에 대표 기사 기준 OG 이미지를 생성하는 스크립트(`scripts/generate-og.mjs`)를 만들어 `npm run build` 앞단에 붙였습니다. 폰트는 최초 실행 시 내려받아 캐시해 CI 반복 실행 비용을 줄였습니다.

**접근성**

키보드와 스크린 리더로 끝까지 읽을 수 있는 것을 기준으로 잡았습니다. 보조 텍스트 명도 대비를 WCAG AA(4.5:1)에 맞추고, 포커스 인디케이터를 개별 컴포넌트가 아니라 글로벌 룰(2px accent outline)로 정의해 컴포넌트마다 어긋나지 않게 했습니다. `main` 랜드마크와 헤딩 위계를 검증하고, 외부 링크에는 새 창 안내를 `sr-only`로 제공하며 장식용 아이콘은 `aria-hidden` 처리했습니다.

**로딩 성능**

폰트를 순차 로딩에서 병렬 `<link>` + `preconnect`로 전환하고 사용하지 않는 가중치를 덜어냈습니다. 스캐폴드 단계에서 딸려온 미사용 shadcn/ui 컴포넌트도 정리해 번들에서 제외했습니다.

---

## 프로젝트 구조

```
src/
  App.tsx                라우팅과 공통 provider
  pages/                 현재 호, 아카이브, 날짜별 상세, 404
  components/news/       도메인 UI 컴포넌트
  components/ui/         shadcn/ui 기반 범용 컴포넌트
  hooks/                 TanStack Query 데이터 훅
  lib/digest-api.ts      fetch, 캐시 무효화, 검증, 정규화
  types/digest.ts        Zod 스키마와 도메인 타입
  types/news.ts          읽기 시간, 카테고리 색상 헬퍼
  test/                  Vitest 설정과 테스트
scripts/generate-og.mjs  OG 이미지 생성
```

---

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:8080
```

| 스크립트 | 설명 |
|---|---|
| `npm run build` | `generate:og` 실행 후 프로덕션 빌드 |
| `npm run generate:og` | `public/daily_digest.json` 기준 `public/og.png` 생성 |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |

**환경변수**

| 변수 | 필수 | 설명 |
|---|---|---|
| `VITE_DIGEST_URL` | O | 최신 호 JSON URL |
| `VITE_DIGEST_BASE` | X | 아카이브 데이터 base URL. 없으면 `VITE_DIGEST_URL`에서 파일명을 제거해 도출 |
| `VITE_SITE_URL` | X | `og:image` 절대 경로 생성용. 배포 환경에서는 실제 URL 필요 |

---

## 데이터 계약

최신 호는 `VITE_DIGEST_URL`에서, 아카이브는 `VITE_DIGEST_BASE/index.json`과 각 엔트리의 `path`로 가져옵니다.

```jsonc
{
  "date": "2026-02-02",
  "selectionCriteria": "① 내일도 영향이 남는 이슈 ② 과도한 감정 소모 제외",
  "lastUpdatedAt": "2026-02-02T07:30:00+09:00",
  "items": [
    {
      "id": "2026-02-02_tech_1",
      "category": "기술",
      "title": "기사 제목",
      "summary": ["핵심 요약 문장"],
      "whyImportant": "왜 중요한지 설명",
      "source": { "name": "출처", "url": "https://example.com/article" },
      "status": "published",
      "importance": 1
    }
  ]
}
```

- 카테고리: `경제` `산업` `기술` `금융` `정책` `국제` `사회` `라이프` `헬스` `환경` `에너지` `모빌리티`
- `status`가 `draft`인 기사는 숨김
- `importance`는 내림차순 정렬 키

---

## 라이선스

MIT
