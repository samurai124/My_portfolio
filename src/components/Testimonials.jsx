import React from 'react';

function Testimonials({ testimonials, testimonialsContainerRef, scrollTestimonials, copy }) {
  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20 bg-surface-container-low border-y border-outline-variant/30 overflow-hidden">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.focus.kicker}</span>
          <h2 className="font-headline-lg text-2xl md:text-4xl text-primary font-bold">{copy.focus.title}</h2>
          <p className="text-on-surface-variant mt-2 text-xs sm:text-sm max-w-lg">
            {copy.focus.description}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollTestimonials('left')}
            className="w-10 h-10 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary active:scale-95 transition-all cursor-pointer"
            aria-label="Previous testimonial"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <button 
            onClick={() => scrollTestimonials('right')}
            className="w-10 h-10 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary active:scale-95 transition-all cursor-pointer"
            aria-label="Next testimonial"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      <div 
        ref={testimonialsContainerRef}
        className="flex gap-gutter overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {testimonials.map((t) => (
          <div 
            key={t.id} 
            className="min-w-[270px] sm:min-w-[320px] md:min-w-[420px] max-w-[460px] snap-start bg-surface-container p-6 border border-outline-variant/30 flex flex-col justify-between"
          >
            <div>
              <span className="material-symbols-outlined text-3xl mb-3 text-primary opacity-60 block">format_quote</span>
              <p className="font-body-md text-on-surface mb-6 text-xs sm:text-sm leading-relaxed italic">"{t.quote}"</p>
            </div>
            <div className="flex items-center gap-3 border-t border-outline-variant/20 pt-3">
              <div className="w-10 h-10 bg-surface-container-highest overflow-hidden border border-outline-variant/20">
                <img className="w-full h-full object-cover grayscale" src={t.image} alt={t.name} />
              </div>
              <div>
                <p className="font-bold text-on-surface text-xs sm:text-sm">{t.name}</p>
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
