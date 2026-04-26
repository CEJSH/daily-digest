export function EditorNote() {
  return (
    <section className="border-b border-border py-10 md:py-12">
      <div className="mx-auto max-w-prose">
        <p className="eyebrow mb-4 text-foreground/55">Editor's Note</p>
        <p className="font-serif text-lg leading-[1.6] text-foreground/85 md:text-xl">
          클릭 수가 아니라, <span className="text-foreground">오늘 이후에도</span> 영향을 줄 정보만
          편집했습니다. 매일 아침, 다섯 가지 이상은 만들지 않습니다.
        </p>
      </div>
    </section>
  );
}
