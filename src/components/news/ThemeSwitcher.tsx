import { useState, useEffect } from 'react';

type ThemeVars = {
  background: string;
  card: string;
  highlight: string;
};

type Theme = {
  id: string;
  name: string;
  color: string;
  vars?: ThemeVars;
  isDark?: boolean;
};

const themes: Theme[] = [
  { id: 'default', name: '오프화이트', color: 'bg-[hsl(45,15%,97%)]' },
  {
    id: 'warm',
    name: '웜 베이지',
    color: 'bg-[hsl(35,25%,94%)]',
    vars: { background: '35 25% 94%', card: '35 20% 98%', highlight: '35 20% 90%' },
  },
  {
    id: 'cool',
    name: '쿨 그레이',
    color: 'bg-[hsl(220,10%,95%)]',
    vars: { background: '220 10% 95%', card: '220 10% 99%', highlight: '220 10% 91%' },
  },
  {
    id: 'blue',
    name: '소프트 블루',
    color: 'bg-[hsl(210,30%,96%)]',
    vars: { background: '210 30% 96%', card: '210 25% 99%', highlight: '210 25% 92%' },
  },
  { id: 'dark', name: '다크', color: 'bg-[hsl(0,0%,10%)]', isDark: true },
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
    const theme = themes.find(t => t.id === themeId);

    // Clear any inline overrides so defaults can apply
    root.style.removeProperty('--background');
    root.style.removeProperty('--card');
    root.style.removeProperty('--highlight');
    
    // Remove all theme classes
    themes.forEach(t => root.classList.remove(`theme-${t.id}`));
    
    // Add new theme class
    if (themeId !== 'default') {
      root.classList.add(`theme-${themeId}`);
    }
    
    // Handle dark mode
    if (theme?.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply theme variables directly for light themes (guaranteed override)
    if (theme?.vars) {
      root.style.setProperty('--background', theme.vars.background);
      root.style.setProperty('--card', theme.vars.card);
      root.style.setProperty('--highlight', theme.vars.highlight);
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
