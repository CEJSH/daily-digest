import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeCTA() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // TODO: 실제 구독 API 연동 (예: useMutation으로 POST /api/subscribe)
    toast({
      title: '구독 신청이 접수되었습니다',
      description: `${trimmed} 주소로 매일 아침 보내드릴게요.`,
    });

    setEmail('');
    setError(null);
    setOpen(false);
  };

  return (
    <div className="mt-6 flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-none bg-foreground px-6 py-2 text-sm font-medium tracking-tight text-background hover:bg-foreground/85"
          >
            무료 구독
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl tracking-tight">
              매일 아침, 5개의 뉴스
            </DialogTitle>
            <DialogDescription>
              이메일을 남겨주시면 매일 아침 보내드립니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="subscribe-email">이메일</Label>
              <Input
                id="subscribe-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'subscribe-email-error' : undefined}
              />
              {error && (
                <p
                  id="subscribe-email-error"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
              <Button type="submit">신청하기</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
