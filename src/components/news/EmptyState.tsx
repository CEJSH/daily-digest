import { Coffee } from 'lucide-react';

export function EmptyState() {
  return (
    <section className="py-16 text-center">
      <Coffee className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
      <h2 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-2">
        오늘은 쉬어가는 날입니다
      </h2>
      <p className="text-muted-foreground">
        내일 아침에 다시 정리해드릴게요.
      </p>
    </section>
  );
}
