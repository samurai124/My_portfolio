import React from 'react';

function Hero({ copy }) {
  return (
    <section className="px-4 md:px-margin-edge pt-10 md:pt-14 pb-16 md:pb-24" id="home">
      <h1 className="font-display-xl text-[44px] sm:text-[62px] md:text-[84px] leading-none text-center mb-10 text-primary font-extrabold tracking-tighter">
        Hamza Zaidi
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-12 gap-gutter mb-12 items-start border-y border-outline-variant/30 py-6 text-xs">
        <div className="col-span-2 md:col-span-4">
          <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{copy.hero.roleLabel}</p>
          <p className="text-primary font-semibold">{copy.hero.roleLine1}<br />{copy.hero.roleLine2}</p>
        </div>
        <div className="col-span-1 md:col-start-6 md:col-span-4 text-left md:text-center">
          <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{copy.hero.locationLabel}</p>
          <p className="text-primary font-semibold">{copy.hero.location}</p>
        </div>
        <div className="col-span-1 md:col-span-3 text-right">
          <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{copy.hero.availabilityLabel}</p>
          <p className="text-primary font-semibold">{copy.hero.availability}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center mb-12 px-2">
        <h2 className="text-lg sm:text-xl md:text-2xl leading-relaxed font-normal text-on-background/90">
          {copy.hero.headline}
        </h2>
      </div>

      <div className="w-full aspect-[21/9] bg-surface-container overflow-hidden border border-outline-variant/20">
        <img 
          className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700 ease-out" 
          alt="Portfolio portrait for Hamza Zaidi" 
          src="/hero-portrait.png"
        />
      </div>
    </section>
  );
}

export default Hero;
