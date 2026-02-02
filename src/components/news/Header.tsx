import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
    <header className="text-center py-8 md:py-12 border-b-2 border-foreground">
      {/* 서비스 타이틀 */}
      <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
        오늘, 이 정도만 알면 충분합니다
      </h1>
      
      {/* 날짜 */}
      <p className="text-lg md:text-xl text-muted-foreground font-medium mb-2">
        {formattedDate}
      </p>
      
      {/* 업데이트 시각 */}
      <p className="text-sm text-muted-foreground">
        업데이트: {format(updatedDate, 'yyyy.MM.dd', { locale: ko })} {formattedUpdateTime}
      </p>
    </header>
  );
}
