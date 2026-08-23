import React from 'react';

function BlogDetailModal({ selectedBlog, setSelectedBlog }) {
  if (!selectedBlog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
      <div className="bg-surface border border-outline-variant w-full max-w-xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-outline-variant/40 p-5">
          <div>
            <span className="bg-surface-container text-primary text-[9px] font-label-sm px-2 py-0.5 uppercase tracking-wider border border-outline-variant/30">
              {selectedBlog.category}
            </span>
            <h3 className="text-lg font-bold text-primary mt-1.5">{selectedBlog.title}</h3>
            <div className="text-[10px] text-on-surface-variant mt-0.5 font-label-sm flex items-center gap-1.5">
              <span>{selectedBlog.date}</span>
              <span>•</span>
              <span>{selectedBlog.readTime}</span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedBlog(null)}
            className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            aria-label="Close blog article"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-5 overflow-y-auto max-h-[55vh] space-y-4">
          <div className="w-full aspect-[16/9] overflow-hidden border border-outline-variant/10">
            <img className="w-full h-full object-cover" src={selectedBlog.image} alt={selectedBlog.title} />
          </div>
          <div className="text-on-surface-variant text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3">
            {selectedBlog.content}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-outline-variant/40 p-5 flex justify-end">
          <button 
            onClick={() => setSelectedBlog(null)}
            className="bg-primary text-on-primary px-5 py-2.5 font-label-sm text-[10px] uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
          >
            Finish Reading
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailModal;
