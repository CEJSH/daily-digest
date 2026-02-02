import { DailyQuestion } from '@/types/news';

interface TodayQuestionProps {
  question: DailyQuestion;
}

export function TodayQuestion({ question }: TodayQuestionProps) {
  return (
    <section className="py-10">
      <div className="bg-secondary/40 border border-border rounded-lg p-6 md:p-8 text-center">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          오늘의 질문
        </p>
        <p className="font-serif text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed tracking-tight">
          {question.question}
        </p>
      </div>
    </section>
  );
}
