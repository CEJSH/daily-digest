import { useState, useEffect } from 'react';

const themes = [
  { id: 'default', name: '오프화이트', color: 'bg-[hsl(45,15%,97%)]' },
  { id: 'warm', name: '웜 베이지', color: 'bg-[hsl(35,25%,94%)]' },
  { id: 'cool', name: '쿨 그레이', color: 'bg-[hsl(220,10%,95%)]' },
  { id: 'blue', name: '소프트 블루', color: 'bg-[hsl(210,30%,96%)]' },
  { id: 'dark', name: '다크', color: 'bg-[hsl(0,0%,10%)]' },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('news-theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    themes.forEach(t => root.classList.remove(`theme-${t.id}`));
    
    // Add new theme class
    if (themeId !== 'default') {
      root.classList.add(`theme-${themeId}`);
    }
    
    // Handle dark mode
    if (themeId === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('news-theme', themeId);
    applyTheme(themeId);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <span className="text-xs text-muted-foreground mr-2">배경색</span>
      <div className="flex gap-1.5">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${theme.color} ${
              currentTheme === theme.id 
                ? 'border-foreground scale-110' 
                : 'border-border hover:border-foreground/50'
            } ${theme.id === 'dark' ? 'ring-1 ring-inset ring-white/20' : ''}`}
            title={theme.name}
            aria-label={`${theme.name} 테마로 변경`}
          />
        ))}
      </div>
    </div>
  );
}
