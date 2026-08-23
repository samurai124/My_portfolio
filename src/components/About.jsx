import React from 'react';

function About({ copy }) {
  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20 bg-surface-container-low border-y border-outline-variant/30" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.about.kicker}</span>
          <h2 className="font-headline-lg text-2xl md:text-4xl text-primary font-bold mb-4">{copy.about.title}</h2>
          <p className="text-on-surface-variant mb-6 text-sm sm:text-base leading-relaxed">
            {copy.about.intro}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8 border-t border-outline-variant/30 pt-6">
            <div>
              <h4 className="text-2xl md:text-3xl font-extrabold text-primary">React</h4>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">Frontend</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-extrabold text-primary">API</h4>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{copy.about.stats.api}</p>
            </div>
            <div className="mt-2">
              <h4 className="text-2xl md:text-3xl font-extrabold text-primary">SQL</h4>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{copy.about.stats.databases}</p>
            </div>
            <div className="mt-2">
              <h4 className="text-2xl md:text-3xl font-extrabold text-primary">CI/CD</h4>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{copy.about.stats.deployment}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 lg:pl-6 text-xs sm:text-sm">
          <div className="prose text-on-surface-variant space-y-3 leading-relaxed">
            <p>
              {copy.about.body1}
            </p>
            <p>
              {copy.about.body2}
            </p>
          </div>

          <div className="border-t border-outline-variant/30 pt-6 mt-6">
            <h3 className="font-label-sm text-[10px] uppercase tracking-widest text-primary mb-4 font-semibold">{copy.about.focusTitle}</h3>
            <div className="space-y-4 text-xs">
              {copy.about.focusItems.map((job, idx) => (
                <div key={idx} className="flex gap-3 items-start border-l-2 border-outline-variant pl-3 py-0.5">
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-primary font-bold text-sm">{job.role} <span className="text-on-surface-variant font-normal">@ {job.company}</span></h4>
                      <span className="text-[10px] font-label-sm text-on-surface-variant">{job.period}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">{job.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
