import { Search, Bell, Plus, Menu } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TopbarProps {
  title: string;
  subtitle: string;
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  onMobileMenu?: () => void;
}

export function Topbar({
  title,
  subtitle,
  search,
  onSearch,
  searchPlaceholder = 'Tim kiem...',
  onPrimaryAction,
  primaryActionLabel = 'Them moi',
  onMobileMenu,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-ink-200/60">
      <div className="px-4 lg:px-8 py-4 flex items-center gap-3">
        {onMobileMenu && (
          <button
            onClick={onMobileMenu}
            className="lg:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100 transition-all shrink-0"
          >
            <Menu size={22} />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h2 className="text-lg lg:text-xl font-bold text-ink-900 tracking-tight truncate">
            {title}
          </h2>
          <p className="text-xs lg:text-sm text-ink-400 mt-0.5 truncate hidden sm:block">{subtitle}</p>
        </div>

        <div className="relative hidden md:block group shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-[var(--brand-500)] transition-colors"
          />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-48 lg:w-72 rounded-xl border border-ink-200 bg-white/60 pl-9 pr-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white transition-all duration-200"
          />
        </div>

        <button className="relative p-2 rounded-xl text-ink-500 hover:bg-ink-100 hover:text-ink-700 transition-all duration-200 hover:scale-105 shrink-0">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="btn-primary group shrink-0"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">{primaryActionLabel}</span>
          </button>
        )}

        {/* Mobile search */}
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-ink-200 px-4 py-2.5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-ink-200 bg-ink-50 pl-9 pr-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
