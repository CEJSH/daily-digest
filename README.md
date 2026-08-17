# PICKY Daily News Digest Frontend

PICKY는 하루에 필요한 뉴스를 최소한으로 선별해 보여주는 일간 뉴스 다이제스트 프론트엔드입니다. 현재 호, 지난 호 아카이브, 날짜별 상세 페이지를 제공하며, 데이터는 백엔드가 발행한 정적 JSON을 런타임에 가져와 렌더링합니다.

## 주요 기능

- 오늘의 다이제스트: `/`
- 아카이브 목록: `/archive`
- 날짜별 지난 호: `/archive/:date`
- 카테고리별 기사 비중, 전체 읽기 시간, 기사별 읽기 시간 표시
- 라이트/다크 테마 전환
- 빌드 타임 OG 이미지 생성: `public/daily_digest.json`의 대표 기사 기준으로 `public/og.png` 생성
- Zod 기반 JSON 스키마 검증 및 레거시 카테고리 라벨 정규화

## 기술 스택

- Vite
- React 18
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui 기반 UI 컴포넌트
- Zod
- Vitest
- Satori + Resvg OG 이미지 생성

## 시작하기

```sh
npm install
cp .env.example .env.local
npm run dev
```

개발 서버 기본 주소는 `http://localhost:8080`입니다.

## 환경변수

`.env.example`을 `.env.local`로 복사한 뒤 값을 설정합니다.

```sh
VITE_DIGEST_URL=http://localhost:8080/daily_digest.json
VITE_DIGEST_BASE=https://example.com/data
VITE_SITE_URL=https://daily-digest.vercel.app
```

- `VITE_DIGEST_URL`: 오늘의 다이제스트 JSON URL입니다. 필수입니다.
- `VITE_DIGEST_BASE`: 아카이브 데이터 디렉터리 base URL입니다. 선택값입니다. 없으면 `VITE_DIGEST_URL`에서 파일명을 제거해 자동 도출합니다.
- `VITE_SITE_URL`: `og:image`, `twitter:image` 절대 경로 생성에 사용합니다. 배포 환경에서는 실제 프로덕션 URL을 넣어야 합니다.

## 데이터 계약

현재 호는 `VITE_DIGEST_URL`에서 가져옵니다. 아카이브는 `VITE_DIGEST_BASE/index.json`과 각 엔트리의 `path`로 지정된 JSON을 가져옵니다.

오늘의 다이제스트 예시:

```json
{
  "date": "2026-02-02",
  "selectionCriteria": "① 내일도 영향이 남는 이슈 ② 과도한 감정 소모 제외",
  "question": "정보를 덜 보는 것이 오히려 더 똑똑한 소비일까?",
  "lastUpdatedAt": "2026-02-02T07:30:00+09:00",
  "items": [
    {
      "id": "2026-02-02_tech_1",
      "date": "2026-02-02",
      "category": "기술",
      "title": "AI 에이전트 경쟁, 도구 연결이 승부처로 떠오름",
      "summary": ["핵심 요약 문장"],
      "whyImportant": "왜 중요한지 설명",
      "sourceUrl": "https://example.com/article",
      "source": { "name": "Source", "url": "https://example.com/article" },
      "status": "published",
      "importance": 1
    }
  ]
}
```

아카이브 인덱스 예시:

```json
{
  "entries": [
    {
      "date": "2026-06-19",
      "path": "archive/2026-06-19.json",
      "count": 12
    }
  ]
}
```

카테고리는 `경제`, `산업`, `기술`, `금융`, `정책`, `국제`, `사회`, `라이프`, `헬스`, `환경`, `에너지`, `모빌리티`를 사용합니다. 레거시 라벨 `IT`, `글로벌`은 프론트에서 각각 `기술`, `국제`로 정규화합니다.

`status`가 `draft`인 기사는 숨깁니다. 그 외 값은 노출합니다. `importance`는 높은 값이 먼저 오도록 정렬 키로 사용합니다.

## 명령어

```sh
npm run dev
npm run build
npm run build:dev
npm run preview
npm run test
npm run lint
npm run generate:og
```

- `npm run build`: `generate:og` 실행 후 Vite 프로덕션 빌드를 수행합니다.
- `npm run generate:og`: `public/daily_digest.json`을 읽어 `public/og.png`를 생성합니다. 최초 실행 시 Noto Serif KR Bold 폰트를 다운로드해 `node_modules/.cache/og-fonts`에 캐시합니다.

## 프로젝트 구조

```text
src/
  App.tsx                    라우팅과 공통 provider
  pages/                     현재 호, 아카이브, 날짜별 상세, 404 페이지
  components/news/           PICKY 도메인 UI 컴포넌트
  components/ui/             shadcn/ui 기반 범용 컴포넌트
  hooks/                     TanStack Query 데이터 훅
  lib/digest-api.ts          JSON fetch, 캐시 무효화, 검증, 정규화
  types/digest.ts            Zod 스키마와 도메인 타입
  types/news.ts              읽기 시간, 카테고리 색상 헬퍼
  test/                      Vitest 설정과 테스트
scripts/
  generate-og.mjs            OG 이미지 생성 스크립트
public/
  daily_digest.json          로컬 샘플 및 OG 생성 입력
```

## 운영 메모

- 런타임 fetch에는 cache bust query를 붙이고 `cache: "no-store"`를 사용합니다.
- 아카이브 인덱스는 최신순으로 다시 정렬해 사용합니다.
- 과거 날짜 스냅샷은 불변 데이터로 보고 TanStack Query에서 무기한 캐시합니다.
- `public/daily_digest.json`은 앱 런타임의 기본 소스가 아니라 로컬 샘플 및 OG 생성 입력입니다. 런타임 데이터는 `VITE_DIGEST_URL`을 기준으로 가져옵니다.
