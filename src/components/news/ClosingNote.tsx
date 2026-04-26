export function ClosingNote() {
  return (
    <section
      data-area="closing"
      className="border-t border-rule/20 py-12 md:py-16"
    >
      <div className="mx-auto max-w-prose">
        <span aria-hidden className="mb-6 block h-px w-12 bg-foreground/30" />
        <p className="font-serif text-lg leading-snug text-foreground/60 md:text-xl">
          오늘의 다이제스트, 여기까지입니다.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60 md:text-base">
          내일 아침 06:00, 같은 자리에서.
        </p>
      </div>
    </section>
  );
}
