import React from 'react';

function Header({ darkMode, setDarkMode, setContactOpen, setActiveTab, activeSection, onOpenAdmin, language, setLanguage, copy }) {
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
        <div className="flex items-center gap-3">
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface-variant bg-surface-container/40 hover:bg-primary hover:text-on-primary hover:border-primary transition-all text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
            aria-label={copy.nav.openCv}
          >
            <span className="material-symbols-outlined text-sm">description</span>
            <span>{copy.nav.cv}</span>
          </a>
          <button
            onClick={onOpenAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface-variant bg-surface-container/40 hover:bg-primary hover:text-on-primary hover:border-primary transition-all text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
            aria-label={copy.nav.openStudio}
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>{copy.nav.studio}</span>
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="w-9 h-9 border border-outline-variant flex items-center justify-center rounded-none text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer font-label-sm text-[10px] uppercase tracking-widest"
            aria-label={copy.nav.changeLanguage}
            title={copy.nav.changeLanguage}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 border border-outline-variant flex items-center justify-center rounded-none text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer"
            aria-label="Toggle Light/Dark Mode"
          >
            <span className="material-symbols-outlined text-lg">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button 
            onClick={() => {
              setActiveTab("message");
              setContactOpen(true);
            }}
            className="bg-primary text-on-primary px-4 py-2 rounded-none font-label-sm text-[11px] hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest cursor-pointer"
          >
            {copy.nav.contact} →
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
