import React, { useState, useEffect, useRef } from 'react';

export default function CommandPalette({
  isOpen,
  onClose,
  projects = [],
  skills = [],
  onSelectProject,
  onOpenCv,
  onOpenContact,
  onOpenSchedule,
  onToggleTheme,
  isDark,
  onOpenStudio
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Cmd+K or Ctrl+K or '/'
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // will trigger open via parent
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const scrollToSection = (id) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText('hamza.zaidi.work@gmail.com');
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedToast(false);
      onClose();
    }, 1200);
  };

  // Compile list of items
  const allActions = [
    {
      id: 'cv',
      type: 'action',
      category: 'Quick Actions',
      title: 'Open Interactive Resume / CV',
      subtitle: 'View qualifications, timeline and download PDF',
      icon: 'description',
      run: () => { onClose(); onOpenCv(); }
    },
    {
      id: 'contact',
      type: 'action',
      category: 'Quick Actions',
      title: 'Send a Message / Inquire',
      subtitle: 'Start a project conversation with Hamza',
      icon: 'mail',
      run: () => { onClose(); onOpenContact(); }
    },
    {
      id: 'schedule',
      type: 'action',
      category: 'Quick Actions',
      title: 'Book a 15-Min Strategy Call',
      subtitle: 'Discuss architecture, timeline or scope',
      icon: 'calendar_month',
      run: () => { onClose(); onOpenSchedule(); }
    },
    {
      id: 'theme',
      type: 'action',
      category: 'Quick Actions',
      title: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
      subtitle: `Currently in ${isDark ? 'Dark' : 'Light'} theme`,
      icon: isDark ? 'light_mode' : 'dark_mode',
      run: () => { onToggleTheme(); }
    },
    {
      id: 'copy-email',
      type: 'action',
      category: 'Quick Actions',
      title: copiedToast ? '✓ Email Copied to Clipboard!' : 'Copy Email Address',
      subtitle: 'hamza.zaidi.work@gmail.com',
      icon: copiedToast ? 'check' : 'content_copy',
      run: copyEmail
    },
    {
      id: 'studio',
      type: 'action',
      category: 'Quick Actions',
      title: 'Open Studio Admin Dashboard',
      subtitle: 'Manage projects, skills, blogs & bookings',
      icon: 'tune',
      run: () => { onClose(); onOpenStudio(); }
    },
    // Navigation
    {
      id: 'nav-projects',
      type: 'navigation',
      category: 'Navigation',
      title: 'Go to Featured Projects',
      subtitle: 'Full-stack apps, APIs & client work',
      icon: 'folder_open',
      run: () => scrollToSection('projects')
    },
    {
      id: 'nav-skills',
      type: 'navigation',
      category: 'Navigation',
      title: 'Go to Technical Skills',
      subtitle: 'Frontend, Backend, Databases & DevOps',
      icon: 'code',
      run: () => scrollToSection('skills')
    },
    {
      id: 'nav-services',
      type: 'navigation',
      category: 'Navigation',
      title: 'Go to Services & Capabilities',
      subtitle: 'What I deliver for teams & companies',
      icon: 'layers',
      run: () => scrollToSection('services')
    },
    {
      id: 'nav-about',
      type: 'navigation',
      category: 'Navigation',
      title: 'Go to About & Background',
      subtitle: 'Engineering philosophy and story',
      icon: 'person',
      run: () => scrollToSection('about')
    },
    {
      id: 'nav-blog',
      type: 'navigation',
      category: 'Navigation',
      title: 'Go to Engineering Blog',
      subtitle: 'Articles on React, architecture & backend',
      icon: 'article',
      run: () => scrollToSection('blog')
    },
    {
      id: 'nav-faq',
      type: 'navigation',
      category: 'Navigation',
      title: 'Go to Frequently Asked Questions',
      subtitle: 'Availability, contracts & workflow',
      icon: 'help_outline',
      run: () => scrollToSection('faq')
    }
  ];

  // Projects dynamically added
  const projectItems = projects.map(p => ({
    id: `project-${p.id}`,
    type: 'project',
    category: 'Projects',
    title: p.title,
    subtitle: `${p.category || 'App'} • ${p.tags ? p.tags.join(', ') : ''}`,
    icon: 'rocket_launch',
    run: () => { onClose(); onSelectProject(p); }
  }));

  // Skills dynamically added
  const skillItems = skills.map((s, idx) => ({
    id: `skill-${s.name || idx}`,
    type: 'skill',
    category: 'Skills & Tools',
    title: s.name,
    subtitle: `${s.category || 'Tech'} • ${s.level || 90}% Proficiency`,
    icon: 'terminal',
    run: () => scrollToSection('skills')
  }));

  const allItems = [...allActions, ...projectItems, ...skillItems];

  const filteredItems = query.trim() === ''
    ? allActions
    : allItems.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      });

  // Handle arrows and Enter
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) current.run();
    }
  };

  // Keep selected item in view
  useEffect(() => {
    const list = listRef.current;
    if (list) {
      const activeEl = list.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-scale-up"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800 gap-3">
          <span className="material-symbols-outlined text-neutral-400 text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search projects, or jump to..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-transparent"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono">
              No results found for "{query}". Try "Projects", "CV", or "Spring Boot".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onClick={() => item.run()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`material-symbols-outlined text-lg shrink-0 ${
                        isSelected
                          ? 'text-white dark:text-neutral-900'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {item.title}
                      </p>
                      <p
                        className={`text-[11px] truncate leading-tight mt-0.5 ${
                          isSelected
                            ? 'text-neutral-300 dark:text-neutral-600'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded ml-2 shrink-0 ${
                      isSelected
                        ? 'bg-white/20 dark:bg-black/10 text-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">↵</kbd> Select
            </span>
          </div>
          <span>
            <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
