import React, { useState } from 'react';

const DEFAULT_SKILLS = [
  // Frontend
  { id: 'sk-1', name: 'React.js', category: 'Frontend', level: 95, icon: 'code', featured: true },
  { id: 'sk-2', name: 'JavaScript (ES6+)', category: 'Frontend', level: 92, icon: 'javascript', featured: true },
  { id: 'sk-3', name: 'TypeScript', category: 'Frontend', level: 85, icon: 'code', featured: true },
  { id: 'sk-4', name: 'Tailwind CSS & Modern UI', category: 'Frontend', level: 90, icon: 'palette', featured: true },
  { id: 'sk-5', name: 'HTML5 & Responsive CSS', category: 'Frontend', level: 95, icon: 'web', featured: false },
  
  // Backend
  { id: 'sk-6', name: 'Java Spring Boot', category: 'Backend', level: 90, icon: 'terminal', featured: true },
  { id: 'sk-7', name: 'PHP & Laravel', category: 'Backend', level: 88, icon: 'data_object', featured: true },
  { id: 'sk-8', name: 'RESTful API & Security (JWT)', category: 'Backend', level: 92, icon: 'lock', featured: true },
  { id: 'sk-9', name: 'Microservices & MVC', category: 'Backend', level: 85, icon: 'hub', featured: false },

  // Database
  { id: 'sk-10', name: 'PostgreSQL', category: 'Database', level: 88, icon: 'database', featured: true },
  { id: 'sk-11', name: 'MySQL', category: 'Database', level: 90, icon: 'database', featured: true },
  { id: 'sk-12', name: 'Supabase & BaaS', category: 'Database', level: 86, icon: 'storage', featured: true },

  // DevOps & Cloud
  { id: 'sk-13', name: 'Docker & Containerization', category: 'DevOps & Cloud', level: 86, icon: 'deployed_code', featured: true },
  { id: 'sk-14', name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps & Cloud', level: 82, icon: 'sync_alt', featured: true },
  { id: 'sk-15', name: 'Linux & Cloud Deployment', category: 'DevOps & Cloud', level: 80, icon: 'cloud_upload', featured: false },

  // Tools & Workflow
  { id: 'sk-16', name: 'Git & GitHub Workflow', category: 'Tools', level: 92, icon: 'fork_right', featured: true },
  { id: 'sk-17', name: 'Postman & API Testing', category: 'Tools', level: 90, icon: 'send_time_extension', featured: true },
  { id: 'sk-18', name: 'Agile / Scrum & Clean Code', category: 'Tools', level: 88, icon: 'check_circle', featured: false }
];

function Skills({ skills = [], copy }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const displaySkills = (skills && skills.length > 0) ? skills : DEFAULT_SKILLS;

  const categories = [
    { key: 'All', label: copy.skills?.filters?.all || 'All' },
    { key: 'Frontend', label: 'Frontend' },
    { key: 'Backend', label: 'Backend' },
    { key: 'Database', label: 'Database' },
    { key: 'DevOps & Cloud', label: 'DevOps & Cloud' },
    { key: 'Tools', label: copy.skills?.filters?.tools || 'Tools & Workflow' }
  ];

  const filteredSkills = activeCategory === 'All'
    ? displaySkills
    : displaySkills.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());

  // Group skills by category when 'All' is selected for a structured layout
  const groupedCategories = activeCategory === 'All'
    ? ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Tools']
    : [activeCategory];

  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20 bg-surface-container-lowest/40 border-y border-outline-variant/30" id="skills">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
            {copy.skills?.kicker || '[ Technical Stack ]'}
          </span>
          <h2 className="font-headline-lg text-2xl md:text-4xl text-primary font-bold">
            {copy.skills?.title || 'Skills & Expertise'}
          </h2>
          <p className="text-on-surface-variant mt-2 text-xs sm:text-sm max-w-xl leading-relaxed">
            {copy.skills?.description || 'A comprehensive overview of programming languages, frameworks, databases, and deployment tools I use to build scalable web applications.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1 font-label-sm text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-primary text-on-primary border-primary font-bold shadow-sm'
                  : 'border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-10">
        {groupedCategories.map((catName) => {
          const catSkills = filteredSkills.filter(
            s => s.category?.toLowerCase() === catName.toLowerCase()
          );

          if (catSkills.length === 0) return null;

          return (
            <div key={catName} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-bold">
                  // {catName}
                </span>
                <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
                <span className="font-label-sm text-[10px] text-on-surface-variant">
                  {catSkills.length} {catSkills.length > 1 ? 'technologies' : 'technology'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id || skill._id || skill.name}
                    className="p-4 bg-surface border border-outline-variant/40 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5 shadow-sm group"
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">
                            {skill.icon || 'terminal'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-primary group-hover:text-primary transition-colors">
                            {skill.name}
                          </h4>
                          <span className="text-[10px] font-mono text-on-surface-variant">
                            {skill.category}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Skills;
