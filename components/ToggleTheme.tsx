import { Sun, MoonIcon } from 'lucide-react';
import { useThemeState } from '@/store/theme.store';

export default function ToggleTheme() {
  const { theme, toggleTheme } = useThemeState();

  const baseClasses = 'p-3 rounded-full flex items-center gap-4';
  const buttonClassName = `${baseClasses}`.trim();

  return (
    <button onClick={toggleTheme} className={buttonClassName}>
      <div className="flex items-center gap-4">
        {theme === 'dark' ? (
          <Sun size={20} className="text-yellow-500" />
        ) : (
          <MoonIcon size={20} className="text-blue-500" />
        )}
      </div>
    </button>
  );
}