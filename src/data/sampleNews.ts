import { NewsItem, DailyQuestion, NewsMeta } from '@/types/news';

// 오늘 날짜 (샘플용)
const TODAY = '2026-02-02';

export const sampleNews: NewsItem[] = [
  {
    id: '1',
    date: TODAY,
    category: 'IT',
    title: '애플, AI 기반 시리 대규모 업그레이드 예고',
    summary: [
      '애플이 올해 하반기 iOS 업데이트에서 시리의 대화 능력을 대폭 강화할 예정이다.',
      '새로운 시리는 맥락을 기억하고, 앱 간 연동 작업을 자연어로 처리할 수 있다.',
      '구글, 삼성과의 AI 비서 경쟁이 본격화되며 사용자 경험 변화가 예상된다.',
    ],
    whyImportant: '스마트폰 사용 방식 자체가 바뀔 수 있는 변화의 시작점입니다.',
    sourceUrl: 'https://example.com/news/1',
    status: 'published',
    importance: 1,
  },
  {
    id: '2',
    date: TODAY,
    category: '경제',
    title: '한국은행, 기준금리 동결 결정... 하반기 인하 시사',
    summary: [
      '한국은행 금융통화위원회가 기준금리를 3.0%로 동결했다.',
      '다만 경기 둔화 우려로 하반기 인하 가능성을 열어두었다.',
      '부동산 시장과 가계부채 관리 사이에서 균형을 찾는 모습이다.',
    ],
    whyImportant: '대출 금리와 예금 금리에 직접적인 영향을 미치는 결정입니다.',
    sourceUrl: 'https://example.com/news/2',
    status: 'published',
    importance: 1,
  },
  {
    id: '3',
    date: TODAY,
    category: '글로벌',
    title: 'EU, 빅테크 규제 본격 시행... 벌금 규모 사상 최대',
    summary: [
      '유럽연합의 디지털시장법(DMA)이 본격 시행에 들어갔다.',
      '애플, 구글, 메타 등이 첫 규제 대상으로 지정되었다.',
      '위반 시 전 세계 매출의 최대 10%까지 벌금이 부과될 수 있다.',
    ],
    whyImportant: '글로벌 빅테크 기업들의 서비스 정책 변화가 예상됩니다.',
    sourceUrl: 'https://example.com/news/3',
    status: 'published',
    importance: 2,
  },
  {
    id: '4',
    date: TODAY,
    category: 'IT',
    title: '오픈AI, GPT-5 개발 중단설 부인... "예정대로 진행"',
    summary: [
      'GPT-5 개발 중단 루머가 퍼졌으나 오픈AI가 공식 부인했다.',
      '다만 안전성 검증에 더 많은 시간을 투자하고 있다고 밝혔다.',
      'AI 기업들의 책임 있는 개발에 대한 논의가 활발해지고 있다.',
    ],
    whyImportant: 'AI 기술 발전 속도와 안전성 사이의 균형점을 보여주는 사례입니다.',
    sourceUrl: 'https://example.com/news/4',
    status: 'published',
    importance: 2,
  },
  {
    id: '5',
    date: TODAY,
    category: '경제',
    title: '반도체 수출 3개월 연속 증가... 회복세 뚜렷',
    summary: [
      '1월 반도체 수출이 전년 대비 35% 증가하며 회복세를 보였다.',
      '메모리 반도체 가격 상승과 AI 서버 수요 증가가 주요 원인이다.',
      '삼성전자와 SK하이닉스의 실적 개선이 기대된다.',
    ],
    whyImportant: '한국 경제의 핵심 수출품목 동향은 경기 전망의 바로미터입니다.',
    sourceUrl: 'https://example.com/news/5',
    status: 'published',
    importance: 1,
  },
];

export const sampleQuestion: DailyQuestion = {
  date: TODAY,
  question: '오늘 읽은 뉴스 중, 1년 후에도 기억에 남을 것 같은 소식은 무엇인가요?',
};

export const sampleMeta: NewsMeta = {
  lastUpdatedAt: '2026-02-02T07:30:00+09:00',
};

// 뉴스가 없는 상태 테스트용
export const emptyNews: NewsItem[] = [];
