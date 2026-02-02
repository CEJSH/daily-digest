import { DailyQuestion } from '@/types/news';

interface TodayQuestionProps {
  question: DailyQuestion;
}

export function TodayQuestion({ question }: TodayQuestionProps) {
  return (
    <section className="py-8 border-b border-border">
      <div className="bg-secondary/50 rounded-lg p-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          오늘의 질문
        </p>
        <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed">
          {question.question}
        </p>
      </div>
    </section>
  );
}
