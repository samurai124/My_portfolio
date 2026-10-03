import React, { useEffect } from 'react';

function ProjectDetailModal({ selectedProject, setSelectedProject, copy = {} }) {
  // Close modal on Escape key and lock body scroll while modal is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject, setSelectedProject]);

  if (!selectedProject) return null;

  const isFrench = copy.nav?.projects === 'Projets' || copy.projects?.filters?.all === 'Tous' || (typeof window !== 'undefined' && localStorage.getItem('language') === 'fr');

  const role = selectedProject.details?.role || selectedProject.category || 'Full-Stack Developer';
  const clientLocation = selectedProject.details?.client || 'Full-Stack Architecture';
  const timeline = selectedProject.details?.timeline || '2025';
  const githubUrl = selectedProject.githubUrl || selectedProject.github_url;
  const liveUrl = selectedProject.liveUrl || selectedProject.live_url;
  const status = selectedProject.status || (isFrench ? 'En Production' : 'Production');

  // Clean domain string for display
  const displayDomain = liveUrl
    ? liveUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    : `${(selectedProject.title || 'project').toLowerCase().replace(/[^a-z0-9]/g, '')}.app`;

  // First letter for the floating monogram badge
  const initial = (selectedProject.title || 'P').trim().charAt(0).toUpperCase();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={() => setSelectedProject(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Modal Card matching projects_card.webp */}
      <div 
        className="relative w-full max-w-[460px] bg-white dark:bg-[#18181b] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] my-auto transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-sm"
          aria-label={isFrench ? "Fermer les détails" : "Close details"}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Top Rounded Banner Block */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-[#121316] dark:bg-white flex items-center justify-center transition-colors">
          {selectedProject.image ? (
            <>
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent flex items-center justify-center p-4">
                <span className="text-white text-base sm:text-lg font-medium tracking-tight drop-shadow-md text-center">
                  Building with <strong className="font-bold">{selectedProject.title}</strong>
                </span>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <span className="text-lg sm:text-xl font-normal tracking-tight text-white dark:text-neutral-900">
                Making software <strong className="font-bold">{selectedProject.title}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Floating Logo Badge overlapping the banner */}
        <div className="relative -mt-7 sm:-mt-8 ml-4 sm:ml-5 z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#121316] dark:bg-white ring-4 ring-white dark:ring-[#18181b] shadow-md flex items-center justify-center text-white dark:text-neutral-950 transition-colors">
          <span className="font-bold text-xl sm:text-2xl font-display tracking-tighter">
            {initial}
          </span>
        </div>

        {/* Project Header Info */}
        <div className="mt-3.5 sm:mt-4 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h3 
                className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight" 
                id="project-modal-title"
              >
                {selectedProject.title}
              </h3>
              {role && (
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                  , {role}
                </span>
              )}
            </div>

            {/* Status Pill with Green Indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-neutral-200/90 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-800/40 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{status}</span>
            </div>
          </div>

          {/* Subtitle / Domain link */}
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-normal">
            {liveUrl ? displayDomain : `${clientLocation} • ${timeline}`}
          </p>

          {/* Tag Pills */}
          {selectedProject.tags && selectedProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-[11px] font-medium rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 bg-transparent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800/80 my-4" />

        {/* Scrollable details container */}
        <div className="space-y-4 max-h-[42vh] overflow-y-auto pr-1">
          {/* Section: About */}
          <div>
            <h4 className="font-bold text-xs sm:text-[13px] text-neutral-900 dark:text-white mb-1.5 tracking-tight">
              {isFrench ? "À propos" : "About"}
            </h4>
            <p className="text-xs sm:text-[12.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {selectedProject.description || "A complete full-stack web application designed with modern React interfaces, secure REST APIs, and structured database storage."}
            </p>
            {selectedProject.details?.challenge && (
              <p className="text-xs sm:text-[12.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2.5">
                {selectedProject.details.challenge}
              </p>
            )}
          </div>

          {/* Location & Website Metadata with Icons */}
          <div className="space-y-1.5 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{clientLocation}</span>
            </div>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group/link"
              >
                <svg className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-2 group-hover/link:decoration-neutral-900 dark:group-hover/link:decoration-white">
                  {displayDomain}
                </span>
              </a>
            )}
          </div>

          {/* Section: Role & Position */}
          <div className="pt-1">
            <h4 className="font-bold text-xs sm:text-[13px] text-neutral-900 dark:text-white mb-1.5 tracking-tight">
              {isFrench ? "Rôle & Position" : "Role & Position"}
            </h4>
            <p className="text-xs sm:text-[12.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {selectedProject.details?.solution || selectedProject.details?.role || "Full-stack engineer responsible for architecting the complete application lifecycle, from data modeling and REST services to intuitive client interfaces and continuous deployment."}
            </p>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-5 mt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:border-neutral-400 dark:hover:border-neutral-500 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{isFrench ? "Voir le Code" : "View Code"}</span>
            </a>
          ) : (
            <button
              onClick={() => setSelectedProject(null)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:border-neutral-400 dark:hover:border-neutral-500 transition-all cursor-pointer"
            >
              {isFrench ? "Fermer" : "Close"}
            </button>
          )}

          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-semibold rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm cursor-pointer"
            >
              <span>{isFrench ? "Visiter le site" : "Visit website"}</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : (
            <button
              onClick={() => setSelectedProject(null)}
              className="px-4 sm:px-5 py-2 text-xs font-semibold rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm cursor-pointer"
            >
              {isFrench ? "Fermer" : "Close"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailModal;
