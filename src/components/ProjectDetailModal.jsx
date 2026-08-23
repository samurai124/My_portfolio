import React from 'react';

function ProjectDetailModal({ selectedProject, setSelectedProject }) {
  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
      <div className="bg-surface border border-outline-variant w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-outline-variant/40 p-5">
          <div>
            <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest">{selectedProject.category}</span>
            <h3 className="text-xl font-bold text-primary mt-0.5">{selectedProject.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedProject(null)}
            className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            aria-label="Close details"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-5">
          <div className="w-full aspect-video overflow-hidden border border-outline-variant/20">
            <img className="w-full h-full object-cover" src={selectedProject.image} alt={selectedProject.title} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-outline-variant/30 py-4 text-xs">
            <div>
              <span className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-widest block mb-0.5">Client</span>
              <span className="text-primary font-semibold">{selectedProject.details.client}</span>
            </div>
            <div>
              <span className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-widest block mb-0.5">Timeline</span>
              <span className="text-primary font-semibold">{selectedProject.details.timeline}</span>
            </div>
            <div>
              <span className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-widest block mb-0.5">My Role</span>
              <span className="text-primary font-semibold">{selectedProject.details.role}</span>
            </div>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <h4 className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Overview</h4>
              <p className="text-on-surface-variant leading-relaxed">{selectedProject.description}</p>
            </div>
            
            <div>
              <h4 className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold mb-1">The Challenge</h4>
              <p className="text-on-surface-variant leading-relaxed">{selectedProject.details.challenge}</p>
            </div>

            <div>
              <h4 className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold mb-1">The Solution</h4>
              <p className="text-on-surface-variant leading-relaxed">{selectedProject.details.solution}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-outline-variant/40 p-5 flex justify-end gap-3">
          <div className="flex gap-1 flex-1 items-center flex-wrap">
            {selectedProject.tags.map(t => (
              <span key={t} className="bg-surface-container text-primary text-[9px] font-label-sm px-2 py-0.5 uppercase tracking-wider border border-outline-variant/30">
                {t}
              </span>
            ))}
          </div>
          <button 
            onClick={() => setSelectedProject(null)}
            className="bg-primary text-on-primary px-5 py-2 font-label-sm text-[10px] uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
          >
            Close Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailModal;
