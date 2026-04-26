import { useState, type FormEvent } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      setErrorMessage("이메일 형식을 다시 확인해주세요.");
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);
    // Mock: client-only stand-in for POST /api/subscribe.
    // Replace with real subscribeApi when backend is ready.
    await new Promise((r) => setTimeout(r, 250));
    setStatus("success");
  }

  function handleChange(value: string) {
    setEmail(value);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage(null);
    }
  }

  return (
    <section
      id="subscribe"
      data-area="subscribe"
      className="scroll-mt-20 border-t border-rule/20 py-16 md:py-20"
    >
      <div className="mx-auto max-w-prose">
        <p className="eyebrow mb-3 text-foreground/65">Subscribe</p>
        <p className="font-serif text-xl font-medium leading-snug text-foreground md:text-2xl">
          매일 아침 06:00, 메일함에서 만나요
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60 md:text-base">
          광고 없이, 다섯 가지만 골라 보내드립니다.
        </p>

        {status === "success" ? (
          <p
            className="mt-10 font-serif text-base leading-relaxed text-foreground/80 md:text-lg"
            role="status"
            aria-live="polite"
          >
            내일 06:00, 같은 자리에서 뵙겠습니다.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end"
            noValidate
          >
            <label className="flex-1">
              <span className="sr-only">이메일 주소</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => handleChange(e.target.value)}
                aria-invalid={status === "error"}
                aria-describedby={
                  errorMessage ? "subscribe-error" : undefined
                }
                className="w-full border-0 border-b border-foreground/30 bg-transparent py-2 text-base text-foreground transition-colors placeholder:text-foreground/65 focus:border-foreground"
              />
            </label>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center border border-foreground/40 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "확인 중…" : "구독하기"}
            </button>
          </form>
        )}

        {errorMessage && (
          <p
            id="subscribe-error"
            className="mt-3 text-sm text-foreground/65"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
