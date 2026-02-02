import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SELECTION_CRITERIA = [
  {
    icon: '📌',
    title: '내일도 영향이 남는 이슈',
    description: '오늘만 휘발되는 뉴스가 아닌, 앞으로의 판단에 영향을 줄 소식',
  },
  {
    icon: '🧘',
    title: '과도한 감정 소모 제외',
    description: '불안·분노를 자극하기 위한 뉴스는 다루지 않습니다',
  },
  {
    icon: '🔄',
    title: '어제와 중복되는 뉴스 제외',
    description: '새로운 정보가 없는 반복 보도는 건너뜁니다',
  },
];

export function SelectionCriteria() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-6 border-b border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            뉴스 선정 기준
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-4">
          <div className="space-y-3">
            {SELECTION_CRITERIA.map((criteria, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-base flex-shrink-0">{criteria.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{criteria.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{criteria.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
