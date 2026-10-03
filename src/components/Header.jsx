import React from 'react';

function Header({ darkMode, setDarkMode, setContactOpen, setActiveTab, activeSection, onOpenAdmin, language, setLanguage, copy, onOpenCv, onOpenCommandPalette }) {
  const cvUrl = 'https://docs.google.com/document/d/1ODKpVIIGCXNVGsjxuZ6ZHz4bE8-KjTEwVXayTTfWFQI/edit?usp=sharing';

  return (
    <header className="w-full h-16 md:h-20 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center px-4 md:px-margin-edge w-full max-w-7xl mx-auto h-full">
        <a className="font-headline-lg text-xl md:text-2xl font-bold text-primary tracking-tight" href="#home">
          Hamza Z.
        </a>
        <nav className="hidden md:flex gap-6">
          {[
            { id: "home", label: copy.nav.home },
            { id: "projects", label: copy.nav.projects },
            { id: "skills", label: copy.nav.skills },
            { id: "services", label: copy.nav.services },
            { id: "about", label: copy.nav.about },
            { id: "blog", label: copy.nav.blog }
          ].map(item => (
            <a
              key={item.id}
              className={`transition-colors font-label-sm text-[11px] pb-1 border-b-2 ${
                activeSection === item.id 
                  ? "text-primary border-primary font-semibold" 
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/60 text-on-surface-variant bg-surface-container/20 hover:border-primary hover:text-primary transition-all text-[11px] font-mono cursor-pointer"
            title="Open Command Palette (Ctrl+K or ⌘K)"
            aria-label="Open Command Palette"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1 py-0.5 bg-surface-container/80 text-[9px] rounded border border-outline-variant/40 leading-none">⌘K</kbd>
          </button>

          <button
            onClick={onOpenCv}
            className="h-8 px-2.5 hidden md:inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/60 text-on-surface-variant bg-surface-container/20 hover:border-primary hover:text-primary transition-all text-[11px] uppercase tracking-wider font-semibold cursor-pointer"
            aria-label={copy.nav.openCv}
          >
            <span className="material-symbols-outlined text-sm">description</span>
            <span>{copy.nav.cv}</span>
          </button>
          <button
            onClick={onOpenAdmin}
            className="h-8 px-2.5 hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/60 text-on-surface-variant bg-surface-container/20 hover:border-primary hover:text-primary transition-all text-[11px] uppercase tracking-wider font-semibold cursor-pointer"
            aria-label={copy.nav.openStudio}
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>{copy.nav.studio}</span>
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-outline-variant/60 text-on-surface-variant hover:border-primary hover:text-primary bg-surface-container/20 transition-all cursor-pointer font-mono text-[11px] font-semibold"
            aria-label={copy.nav.changeLanguage}
            title={copy.nav.changeLanguage}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-outline-variant/60 text-on-surface-variant hover:border-primary hover:text-primary bg-surface-container/20 transition-all cursor-pointer"
            aria-label="Toggle Light/Dark Mode"
          >
            <span className="material-symbols-outlined text-base">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button 
            onClick={() => {
              setActiveTab("message");
              setContactOpen(true);
            }}
            className="h-8 px-3.5 inline-flex items-center justify-center rounded-lg bg-primary text-on-primary text-[11px] hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
          >
            {copy.nav.contact} →
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
