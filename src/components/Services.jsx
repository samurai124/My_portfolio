import React from 'react';

function Services({ services, copy }) {
  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20" id="services">
      <div className="text-center mb-16">
        <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.services.kicker}</span>
        <h2 className="font-headline-lg text-2xl md:text-4xl mb-3 text-primary font-bold">{copy.services.title}</h2>
        <p className="text-on-surface-variant text-xs sm:text-sm max-w-xl mx-auto">
          {copy.services.description}
        </p>
      </div>

      <div className="space-y-0 border-b border-outline-variant/30">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="group py-8 border-t border-outline-variant/30 hover:bg-surface-container/30 px-3 md:px-4 transition-all duration-300"
          >
            <div className="grid grid-cols-4 md:grid-cols-12 items-center gap-4">
              <div className="hidden md:block col-span-1 font-label-sm text-on-surface-variant text-base">[{service.code || service.id}]</div>
              <div className="col-span-4 md:col-span-5">
                <h4 className="font-headline-lg text-lg md:text-xl mb-2 text-on-surface font-bold">{service.title}</h4>
                <p className="text-on-surface-variant text-xs sm:text-sm pr-6 leading-relaxed">{service.description}</p>
              </div>
              <div className="hidden md:flex col-span-6 justify-end gap-3">
                {service.images.map((img, i) => (
                  <div key={i} className="w-28 h-16 bg-surface-container-highest overflow-hidden border border-outline-variant/10 relative">
                    <div className="absolute inset-0 bg-background/25 grayscale z-10 group-hover:grayscale-0 transition-all duration-500"></div>
                    <img 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      alt={service.title} 
                      src={img}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
