import React from 'react';

function Footer({ copy }) {
  const cvUrl = 'https://docs.google.com/document/d/1ODKpVIIGCXNVGsjxuZ6ZHz4bE8-KjTEwVXayTTfWFQI/edit?usp=sharing';

  return (
    <footer className="w-full pt-12 pb-8 bg-surface-dim border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-edge">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter mb-12">
          <div className="col-span-4 md:col-span-4">
            <h2 className="font-display-xl text-[32px] md:text-[44px] font-black text-primary uppercase tracking-tighter">
              Hamza Zaidi
            </h2>
            <p className="text-on-surface-variant text-xs mt-3 max-w-xs font-light leading-relaxed">
              {copy.footer.description}
            </p>
          </div>
          <div className="col-span-2 md:col-span-2 mt-6 md:mt-0">
            <p className="font-label-sm text-[10px] text-primary mb-4 uppercase tracking-wider font-semibold">{copy.footer.pages}</p>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: copy.nav.home },
                { id: 'projects', label: copy.nav.projects },
                { id: 'services', label: copy.nav.services },
                { id: 'about', label: copy.nav.about }
              ].map(item => (
                <li key={item.id}>
                  <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href={`#${item.id}`}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2 mt-6 md:mt-0">
            <p className="font-label-sm text-[10px] text-primary mb-4 uppercase tracking-wider font-semibold">{copy.footer.writings}</p>
            <ul className="space-y-2 text-xs">
              <li><a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#blog">{copy.footer.blogArticles}</a></li>
              <li><a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#faq">{copy.footer.faqs}</a></li>
            </ul>
          </div>
          <div className="col-span-4 md:col-span-4 mt-6 md:mt-0">
            <p className="font-label-sm text-[10px] text-primary mb-4 uppercase tracking-wider font-semibold">{copy.footer.connect}</p>
            <div className="flex gap-3">
              <a 
                className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all text-on-surface-variant" 
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
              >
                <span className="material-symbols-outlined text-sm">terminal</span>
              </a>
              <a 
                className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all text-on-surface-variant" 
                href="https://www.linkedin.com/in/hamza-zaidi-b2a6b7351"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
              >
                <span className="material-symbols-outlined text-sm">code</span>
              </a>
              <a 
                className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all text-on-surface-variant" 
                href="mailto:hamzazaidi253@gmail.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Email Hamza Zaidi"
              >
                <span className="material-symbols-outlined text-sm">cloud</span>
              </a>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-on-surface-variant">
              <a href="mailto:hamzazaidi253@gmail.com" className="block hover:text-primary transition-colors">
                hamzazaidi253@gmail.com
              </a>
              <a href="tel:0626640792" className="block hover:text-primary transition-colors">
                0626640792
              </a>
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-2 items-center gap-1.5 px-3 py-1.5 border border-sky-400/45 text-sky-300 bg-sky-500/10 hover:bg-sky-500 hover:text-white rounded-full transition-all text-[10px] uppercase tracking-widest font-semibold"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                <span>{copy.footer.viewCv}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-label-sm text-[10px] text-on-surface-variant">© {new Date().getFullYear()} Hamza Zaidi. {copy.footer.rights}</p>
          <div className="flex gap-4 text-[10px]">
            <a className="font-label-sm text-on-surface-variant hover:underline" href="#home">Style Guide</a>
            <a className="font-label-sm text-on-surface-variant hover:underline" href="#home">Licenses</a>
            <a className="font-label-sm text-on-surface-variant hover:underline" href="#home">Changelog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
