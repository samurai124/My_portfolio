import React from 'react';

function Projects({ projects, activeFilter, setActiveFilter, setSelectedProject, copy }) {
  // Filter projects based on tag or category
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter || p.tags.includes(activeFilter));

  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20 bg-surface-container-lowest/40 border-y border-outline-variant/30" id="projects">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.projects.kicker}</span>
          <h2 className="font-headline-lg text-2xl md:text-4xl text-primary font-bold">{copy.projects.title}</h2>
          <p className="text-on-surface-variant mt-2 text-xs sm:text-sm max-w-xl">
            {copy.projects.description}
          </p>
        </div>
        
        {/* Tag Filters */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {[
            { value: "All", label: copy.projects.filters.all },
            { value: "Frontend", label: "Frontend" },
            { value: "Backend", label: "Backend" },
            { value: "DevOps", label: "DevOps" },
            { value: "React", label: "React" },
            { value: "Spring Boot", label: "Spring Boot" },
            { value: "Laravel", label: "Laravel" },
            { value: "Docker", label: "Docker" }
          ].map((tag) => (
            <button
              key={tag.value}
              onClick={() => setActiveFilter(tag.value)}
              className={`px-3 py-1 font-label-sm text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
                activeFilter === tag.value 
                  ? "bg-primary text-on-primary border-primary" 
                  : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
        {filteredProjects.map((project, idx) => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className={`group cursor-pointer ${idx % 2 === 1 ? "md:mt-12" : ""}`}
          >
            <div className="aspect-[4/3] bg-surface-container overflow-hidden mb-4 border border-outline-variant/20 relative">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"></div>
              <img 
                className="w-full h-full object-cover project-image grayscale group-hover:grayscale-0 transition-transform duration-500" 
                alt={project.title} 
                src={project.image}
              />
              <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-1.5">
                {project.tags.map(t => (
                  <span key={t} className="bg-background/95 text-primary text-[9px] font-label-sm px-2 py-0.5 uppercase tracking-wider border border-outline-variant/40">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-3">
              <div>
                <span className="text-[9px] font-label-sm uppercase tracking-wider text-on-surface-variant block mb-0.5">{project.category}</span>
                <h3 className="font-headline-lg text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors font-bold">{project.title}</h3>
              </div>
              <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                arrow_outward
              </span>
            </div>
          </div>
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-2 py-16 text-center border border-dashed border-outline-variant/50">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">search_off</span>
            <p className="text-on-surface-variant font-label-sm text-xs">{copy.projects.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
