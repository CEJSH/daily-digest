const Archive = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 md:px-6 py-12">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-center mb-8">
          지난 뉴스 아카이브
        </h1>
        
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            아직 준비 중입니다
          </p>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            ← 오늘의 뉴스로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Archive;
