import React from 'react';

function Faq({ faqs, openFaqs, toggleFaq, copy }) {
  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20 bg-surface-dim border-b border-outline-variant/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.faq.kicker}</span>
          <h2 className="font-display-xl text-3xl md:text-4xl mb-4 text-primary font-bold tracking-tight">{copy.faq.title}</h2>
          <p className="text-on-surface-variant text-xs sm:text-sm">
            {copy.faq.description}
          </p>
        </div>
        <div className="lg:col-span-8 divide-y divide-outline-variant/30">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-5 first:pt-0 last:pb-0">
              <button 
                onClick={() => toggleFaq(idx)}
                className="flex justify-between items-center w-full text-left font-semibold hover:text-primary transition-colors focus:outline-none cursor-pointer"
              >
                <h3 className="font-headline-lg text-sm sm:text-base md:text-lg text-on-surface">{faq.question}</h3>
                <span 
                  className="material-symbols-outlined text-on-surface-variant transition-transform duration-300 ml-4 text-base"
                  style={{ transform: openFaqs[idx] ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  add
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqs[idx] ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed bg-surface/50 p-3.5 border-l border-primary">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
