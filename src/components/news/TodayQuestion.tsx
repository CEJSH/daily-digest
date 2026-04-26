import { DailyQuestion } from "@/types/news";

interface TodayQuestionProps {
  question: DailyQuestion;
}

export function TodayQuestion({ question }: TodayQuestionProps) {
  return (
    <section className="border-t border-rule py-[5.5rem] md:py-[6.5rem]">
      <div className="mx-auto max-w-prose">
        {/* Inner ceremonial hairline — quiet 20% rule frames the sign-off */}
        <div className="border-t border-rule/20 pt-10 md:pt-12">
          <p className="eyebrow mb-6 text-accent">오늘의 질문</p>
          <p className="pull-quote font-serif text-2xl font-medium leading-[1.4] tracking-[-0.02em] text-foreground md:text-[2rem]">
            {question.question}
          </p>
          <p className="mt-6 text-sm text-foreground/55">
            잠시 멈춰, 오늘 읽은 뉴스가 자신에게 어떤 의미였는지 생각해보세요.
          </p>
        </div>
      </div>
    </section>
  );
}
