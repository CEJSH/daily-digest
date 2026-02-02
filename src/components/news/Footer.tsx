import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-8 text-center space-y-6">
      {/* 서비스 철학 */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          더 적게, 더 깊이.
        </p>
        <p className="text-xs text-muted-foreground/70">
          하루에 필요한 뉴스는 5개면 충분합니다.
        </p>
      </div>

      {/* 구분선 */}
      <div className="border-t border-border" />

      {/* 아카이브 링크 (SEO/미래 자산용) */}
      <div>
        <Link 
          to="/archive" 
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          지난 뉴스 보기 →
        </Link>
      </div>

      {/* 광고 영역 자리 (AdSense) */}
      {/* TODO: 광고 코드 삽입 위치 */}
      <div className="bg-muted/30 rounded p-4 text-xs text-muted-foreground/50">
        광고 영역
      </div>

      {/* 저작권 */}
      <p className="text-xs text-muted-foreground/50">
        © 2026 오늘의 뉴스. All rights reserved.
      </p>
    </footer>
  );
}
