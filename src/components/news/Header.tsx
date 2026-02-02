import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  lastUpdatedAt: string;
}

export function Header({ lastUpdatedAt }: HeaderProps) {
  const today = new Date();
  const updatedDate = new Date(lastUpdatedAt);
  
  const formattedDate = format(today, 'yyyy년 M월 d일 EEEE', { locale: ko });
  const formattedUpdateTime = format(updatedDate, '오전/오후 h:mm', { locale: ko })
    .replace('오전/오후', updatedDate.getHours() < 12 ? '오전' : '오후');

  return (
    <header className="text-center py-10 md:py-16 border-b-2 border-foreground">
      {/* 테마 스위처 */}
      <ThemeSwitcher />
      
      {/* 서비스 타이틀 */}
      <h1 className="font-serif text-[1.75rem] md:text-[2.25rem] lg:text-[2.75rem] font-bold tracking-tighter mb-4 leading-tight">
        오늘, 당신을 위한 최소한의 뉴스
      </h1>
      
      {/* 날짜 */}
      <p className="text-base md:text-lg text-foreground/70 font-medium mb-2 tracking-tight">
        {formattedDate}
      </p>
      
      {/* 업데이트 시각 */}
      <p className="text-sm text-muted-foreground tracking-normal">
        업데이트: {format(updatedDate, 'yyyy.MM.dd', { locale: ko })} {formattedUpdateTime}
      </p>
    </header>
  );
}
