/**
 * Masthead 하단 '무료 구독' 버튼.
 *
 * 모달을 띄우는 대신 페이지 하단 SubscribeForm 섹션(id="subscribe")으로
 * 부드럽게 스크롤시킨다. 폼 로직은 SubscribeForm 한 곳에 집중되며,
 * 이 컴포넌트는 시각적 affordance + 앵커 링크 역할만 담당한다.
 *
 * scroll-behavior: smooth는 index.css에 글로벌 적용(prefers-reduced-motion
 * 시 즉시 점프). SubscribeForm의 scroll-mt-20은 sticky TopBar 가림 방지.
 */
export function SubscribeCTA() {
  return (
    <div className="mt-6 flex justify-center">
      <a
        href="#subscribe"
        className="inline-flex items-center justify-center bg-foreground px-6 py-2 text-sm font-medium tracking-tight text-background transition-colors hover:bg-foreground/85"
      >
        무료 구독
      </a>
    </div>
  );
}
