export function EmptyState() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-prose text-center">
        <p className="eyebrow mb-6 text-accent">No Issue Today</p>
        <h2 className="font-serif text-2xl font-bold leading-snug tracking-[-0.02em] text-foreground md:text-[1.875rem]">
          오늘은 전할 만한 새 소식이 없습니다.
        </h2>
        <p className="mt-4 text-base text-foreground/65 md:text-[1.0625rem]">
          억지로 기사를 만들어내지 않습니다. <br className="hidden sm:block" />
          내일 아침 다시 정리해 전해드리겠습니다.
        </p>
      </div>
    </section>
  );
}
