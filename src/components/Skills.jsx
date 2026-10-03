import React, { useState } from 'react';

// Geometric Wireframe Line Art Components matching the screenshot design
function GeometricArt({ type, className = 'w-16 h-16' }) {
  switch (type) {
    case 'concentric':
      // Concentric circles with center dot (Bitcoin card)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <circle cx="40" cy="40" r="35" strokeWidth="1.25" />
          <circle cx="40" cy="40" r="26" strokeWidth="1.25" />
          <circle cx="40" cy="40" r="17" strokeWidth="1.25" />
          <circle cx="40" cy="40" r="8" strokeWidth="1.25" />
          <circle cx="40" cy="40" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'venn':
      // 3 overlapping circles (Ethereum card)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <circle cx="40" cy="30" r="20" strokeWidth="1.25" />
          <circle cx="27" cy="52" r="20" strokeWidth="1.25" />
          <circle cx="53" cy="52" r="20" strokeWidth="1.25" />
        </svg>
      );

    case 'stacked_ellipses':
      // 5 stacked wireframe horizontal ellipses (Solana card)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <ellipse cx="40" cy="18" rx="32" ry="7.5" strokeWidth="1.25" />
          <ellipse cx="40" cy="29" rx="32" ry="7.5" strokeWidth="1.25" />
          <ellipse cx="40" cy="40" rx="32" ry="7.5" strokeWidth="1.25" />
          <ellipse cx="40" cy="51" rx="32" ry="7.5" strokeWidth="1.25" />
          <ellipse cx="40" cy="62" rx="32" ry="7.5" strokeWidth="1.25" />
        </svg>
      );

    case 'network':
      // Constellation network grid mesh with dots at vertices (Cardano card)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <path
            d="M18 26 L42 22 L64 28 M14 48 L38 46 L66 42 M20 68 L44 72 L66 66 M18 26 L14 48 L20 68 M42 22 L38 46 L44 72 M64 28 L66 42 L66 66 M18 26 L38 46 M38 46 L64 28 M14 48 L44 72"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {[
            [18, 26], [42, 22], [64, 28],
            [14, 48], [38, 46], [66, 42],
            [20, 68], [44, 72], [66, 66]
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="white"
              className="dark:fill-[#18181b]"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          ))}
        </svg>
      );

    case 'starburst':
      // Radial dotted starburst radiating from center (Dogecoin card)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="currentColor">
          {Array.from({ length: 16 }).flatMap((_, spoke) => {
            const angle = (spoke * 360 / 16) * (Math.PI / 180);
            return [6, 11, 17, 23, 29, 35].map((dist, dIdx) => {
              const cx = 40 + dist * Math.cos(angle);
              const cy = 40 + dist * Math.sin(angle);
              const r = dIdx < 2 ? 1.0 : dIdx < 4 ? 1.25 : 1.5;
              return <circle key={`${spoke}-${dIdx}`} cx={cx.toFixed(2)} cy={cy.toFixed(2)} r={r} />;
            });
          })}
        </svg>
      );

    case 'origami':
      // Intersecting folded wireframe polygon / hourglass geometry (XRP card)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <rect x="12" y="24" width="56" height="38" strokeWidth="1.25" />
          <path d="M12 24 L40 70 L68 24" strokeWidth="1.25" />
          <path d="M12 62 L40 16 L68 62" strokeWidth="1.25" />
          <line x1="12" y1="24" x2="68" y2="62" strokeWidth="1.25" />
          <line x1="12" y1="62" x2="68" y2="24" strokeWidth="1.25" />
        </svg>
      );

    case 'atomic':
      // Atomic orbit rings (React iconic representation)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <ellipse cx="40" cy="40" rx="33" ry="12" strokeWidth="1.25" />
          <ellipse cx="40" cy="40" rx="33" ry="12" strokeWidth="1.25" transform="rotate(60 40 40)" />
          <ellipse cx="40" cy="40" rx="33" ry="12" strokeWidth="1.25" transform="rotate(120 40 40)" />
          <circle cx="40" cy="40" r="3" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'cube':
      // 3D isometric cube wireframe (Docker & microservices)
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <polygon points="40,14 66,29 66,59 40,74 14,59 14,29" strokeWidth="1.25" strokeLinejoin="round" />
          <line x1="40" y1="44" x2="40" y2="74" strokeWidth="1.25" />
          <line x1="40" y1="44" x2="14" y2="29" strokeWidth="1.25" />
          <line x1="40" y1="44" x2="66" y2="29" strokeWidth="1.25" />
          <line x1="40" y1="14" x2="40" y2="44" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        </svg>
      );

    case 'waveform':
    default:
      // Parallel harmonic waveforms
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor">
          <path d="M12 28 Q26 14, 40 28 T68 28" strokeWidth="1.25" />
          <path d="M12 40 Q26 26, 40 40 T68 40" strokeWidth="1.25" />
          <path d="M12 52 Q26 38, 40 52 T68 52" strokeWidth="1.25" />
          <circle cx="26" cy="21" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="54" cy="47" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

// Rich contextual metadata for each technology
const SKILL_METADATA = {
  'React.js': {
    subtitleEn: 'Frontend Architecture & State',
    subtitleFr: 'Architecture Frontend & État',
    noteEn: 'Component-driven interfaces, custom hooks, and high-performance rendering for modern web apps.',
    noteFr: 'Interfaces basées sur les composants, hooks sur mesure et rendu réactif haute performance.',
    artType: 'atomic',
    tags: ['Hooks', 'Context / Zustand', 'Vite', 'Clean UI'],
    level: 95
  },
  'Java Spring Boot': {
    subtitleEn: 'Enterprise Backend & APIs',
    subtitleFr: 'Backend Entreprise & APIs',
    noteEn: 'Robust enterprise REST APIs with Spring Security, JPA/Hibernate, and layered clean architecture.',
    noteFr: 'APIs REST d\'entreprise robustes avec Spring Security, JPA/Hibernate et architecture en couches.',
    artType: 'cube',
    tags: ['Spring Security', 'JPA / Hibernate', 'REST APIs', 'Maven'],
    level: 90
  },
  'TypeScript': {
    subtitleEn: 'Type-Safe Web Applications',
    subtitleFr: 'Applications Web Typées',
    noteEn: 'Strict type safety, end-to-end interfaces, and scalable maintainable architecture.',
    noteFr: 'Typage strict, interfaces de bout en bout et architecture scalable et maintenable.',
    artType: 'origami',
    tags: ['Generics', 'Strict Mode', 'Type Inference', 'Scalability'],
    level: 85
  },
  'PHP & Laravel': {
    subtitleEn: 'Modern MVC & Full-Stack Systems',
    subtitleFr: 'MVC Moderne & Systèmes Full-Stack',
    noteEn: 'Elegant backend architectures with Eloquent ORM, middleware, queues, and REST services.',
    noteFr: 'Architectures backend élégantes avec Eloquent ORM, middlewares, files d\'attente et APIs REST.',
    artType: 'venn',
    tags: ['Eloquent ORM', 'Blade / Inertia', 'Artisan', 'Authentication'],
    level: 88
  },
  'Docker & Containerization': {
    subtitleEn: 'DevOps & Environment Parity',
    subtitleFr: 'DevOps & Parité des Environnements',
    noteEn: 'Containerized reproducible microservices, multi-stage builds, and Docker Compose environments.',
    noteFr: 'Microservices conteneurisés reproductibles, builds multi-étapes et environnements Docker Compose.',
    artType: 'stacked_ellipses',
    tags: ['Docker Compose', 'Multi-stage Builds', 'Isolation', 'Cloud Ready'],
    level: 86
  },
  'PostgreSQL': {
    subtitleEn: 'Relational Database & Integrity',
    subtitleFr: 'Base de Données & Intégrité',
    noteEn: 'ACID transactions, relational schemas, indexing strategies, and query performance tuning.',
    noteFr: 'Transactions ACID, schémas relationnels, stratégies d\'indexation et optimisation SQL.',
    artType: 'network',
    tags: ['ACID', 'Indexing', 'Relational Schemas', 'Query Tuning'],
    level: 88
  },
  'JavaScript (ES6+)': {
    subtitleEn: 'Core Engine & Async Execution',
    subtitleFr: 'Moteur & Exécution Asynchrone',
    noteEn: 'Deep understanding of event loop, promises, async/await, closures, and modern ES specs.',
    noteFr: 'Maîtrise de l\'event loop, des promesses, async/await et des fonctionnalités ES modernes.',
    artType: 'starburst',
    tags: ['Async / Await', 'ESNext', 'DOM API', 'Functional Patterns'],
    level: 92
  },
  'Tailwind CSS & Modern UI': {
    subtitleEn: 'Design Systems & Responsive UI',
    subtitleFr: 'Design Systems & UI Réactive',
    noteEn: 'Pixel-perfect responsive design systems, smooth transitions, dark mode, and maintainable tokens.',
    noteFr: 'Design systems réactifs au pixel près, transitions fluides, mode sombre et tokens CSS.',
    artType: 'stacked_ellipses',
    tags: ['Responsive UI', 'Dark Mode', 'Design Systems', 'Micro-interactions'],
    level: 90
  },
  'RESTful API & Security (JWT)': {
    subtitleEn: 'API Design & Token Auth',
    subtitleFr: 'Conception d\'API & Authentification',
    noteEn: 'Stateless JWT auth, role-based access control (RBAC), rate-limiting, and sanitized payloads.',
    noteFr: 'Authentification JWT sans état, contrôle d\'accès par rôle (RBAC) et endpoints sécurisés.',
    artType: 'origami',
    tags: ['JWT Auth', 'RBAC', 'CORS / CSRF', 'Clean REST'],
    level: 92
  },
  'Supabase & BaaS': {
    subtitleEn: 'BaaS, Auth & Realtime Sync',
    subtitleFr: 'BaaS, Auth & Synchro Temps Réel',
    noteEn: 'Serverless backend workflows, Row Level Security (RLS), auth providers, and realtime sync.',
    noteFr: 'Workflows backend serverless, Row Level Security (RLS) et synchronisation temps réel.',
    artType: 'network',
    tags: ['Row Level Security', 'Postgres Functions', 'Auth', 'Realtime'],
    level: 86
  },
  'CI/CD Pipelines (GitHub Actions)': {
    subtitleEn: 'Automated Build & Deployment',
    subtitleFr: 'Build & Déploiement Automatisés',
    noteEn: 'Automated test runners, linting pipelines, Docker build triggers, and zero-downtime shipping.',
    noteFr: 'Exécution automatisée des tests, pipelines de lint, builds Docker et déploiements continus.',
    artType: 'waveform',
    tags: ['GitHub Actions', 'Automated Testing', 'Docker Push', 'CD Workflows'],
    level: 82
  },
  'Git & GitHub Workflow': {
    subtitleEn: 'Version Control & Collaboration',
    subtitleFr: 'Gestion de Versions & Collaboration',
    noteEn: 'Feature branching, clean semantic commits, rebase workflows, and collaborative pull requests.',
    noteFr: 'Branches de fonctionnalités, commits sémantiques clairs, rebase et pull requests structurées.',
    artType: 'network',
    tags: ['Git Flow', 'Semantic Commits', 'Code Review', 'Branching'],
    level: 92
  },
  'Microservices & MVC': {
    subtitleEn: 'Distributed & Layered Architecture',
    subtitleFr: 'Architecture Distribuée & MVC',
    noteEn: 'Separation of concerns, decoupled service boundaries, and domain-driven design principles.',
    noteFr: 'Séparation des responsabilités, découplage des services et conception orientée domaine.',
    artType: 'cube',
    tags: ['Layered Arch', 'Domain Modeling', 'Decoupling', 'Clean Code'],
    level: 85
  },
  'MySQL': {
    subtitleEn: 'Relational Storage & Queries',
    subtitleFr: 'Stockage Relationnel & Requêtes',
    noteEn: 'Structured relational data management, foreign keys, stored procedures, and index tuning.',
    noteFr: 'Gestion de données relationnelles, clés étrangères, procédures et optimisation des requêtes.',
    artType: 'concentric',
    tags: ['InnoDB', 'Query Optimization', 'Indexes', 'Relations'],
    level: 90
  },
  'Postman & API Testing': {
    subtitleEn: 'API Verification & Integration Tests',
    subtitleFr: 'Vérification d\'API & Tests d\'Intégration',
    noteEn: 'Automated request suites, environment variables, authentication testing, and contract mocks.',
    noteFr: 'Suites de tests automatisées, variables d\'environnement, tests d\'auth et mocks d\'API.',
    artType: 'starburst',
    tags: ['Test Collections', 'Env Variables', 'Mock Servers', 'Contract Testing'],
    level: 90
  },
  'Linux & Cloud Deployment': {
    subtitleEn: 'Server Administration & Nginx',
    subtitleFr: 'Administration Serveur & Nginx',
    noteEn: 'Ubuntu/Debian server setup, SSH security, Nginx reverse proxy, and systemd process management.',
    noteFr: 'Configuration de serveurs Ubuntu/Debian, sécurité SSH, reverse proxy Nginx et systemd.',
    artType: 'concentric',
    tags: ['Ubuntu / Debian', 'Nginx Reverse Proxy', 'SSH / Keys', 'Systemd'],
    level: 80
  },
  'HTML5 & Responsive CSS': {
    subtitleEn: 'Semantic Web & Accessibility',
    subtitleFr: 'Web Sémantique & Accessibilité',
    noteEn: 'Accessible semantic markup (WCAG), CSS Grid/Flexbox layouts, and cross-browser resilience.',
    noteFr: 'Balisage sémantique accessible (WCAG), mises en page CSS Grid/Flexbox et compatibilité.',
    artType: 'stacked_ellipses',
    tags: ['Semantic HTML', 'WCAG A11y', 'CSS Grid', 'Flexbox'],
    level: 95
  },
  'Agile / Scrum & Clean Code': {
    subtitleEn: 'Sprint Delivery & SOLID Principles',
    subtitleFr: 'Livraison Sprint & Principes SOLID',
    noteEn: 'Pragmatic iteration cycles, SOLID object-oriented design, DRY standards, and code reviews.',
    noteFr: 'Cycles itératifs pragmatiques, principes SOLID, standards DRY et revues de code rigoureuses.',
    artType: 'venn',
    tags: ['SOLID Principles', 'Sprint Planning', 'DRY / KISS', 'Code Audits'],
    level: 88
  }
};

const ART_CYCLE = ['concentric', 'venn', 'stacked_ellipses', 'network', 'starburst', 'origami', 'atomic', 'cube', 'waveform'];

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

function Skills({ skills = [], copy = {} }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedSkillId, setExpandedSkillId] = useState(null);

  const displaySkills = (skills && skills.length > 0) ? skills : DEFAULT_SKILLS;

  // Language detection from copy
  const isFrench = copy.skills?.filters?.all === 'Tous' || copy.nav?.skills === 'Compétences';

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

  const toggleExpand = (id) => {
    setExpandedSkillId(prev => (prev === id ? null : id));
  };

  return (
    <section 
      className="relative px-4 sm:px-6 md:px-margin-edge py-16 md:py-24 bg-[#F8F9FC] dark:bg-[#0c0c0e] overflow-hidden border-y border-outline-variant/20 transition-colors duration-300" 
      id="skills"
    >
      {/* Ambient background soft radiant glow matching screenshot atmosphere */}
      <div 
        className="pointer-events-none absolute -bottom-24 -right-24 w-[480px] h-[480px] bg-gradient-to-br from-pink-300/35 via-purple-300/25 to-blue-200/20 dark:from-purple-900/15 dark:via-pink-900/10 dark:to-transparent rounded-full blur-3xl opacity-80" 
        aria-hidden="true"
      />
      <div 
        className="pointer-events-none absolute -top-28 -left-28 w-[450px] h-[450px] bg-gradient-to-br from-blue-100/50 via-indigo-100/30 to-transparent dark:from-indigo-950/20 dark:via-blue-950/10 dark:to-transparent rounded-full blur-3xl opacity-70" 
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
              {copy.skills?.kicker || '[ Technical Stack ]'}
            </span>
            <h2 className="font-headline-lg text-2xl md:text-4xl text-neutral-900 dark:text-white font-bold tracking-tight">
              {copy.skills?.title || 'Skills & Expertise'}
            </h2>
            <p className="text-on-surface-variant mt-2 text-xs sm:text-sm max-w-xl leading-relaxed">
              {copy.skills?.description || 'A comprehensive overview of programming languages, frameworks, databases, and deployment tools I use to build scalable web applications.'}
            </p>
          </div>

          {/* Clean Pill Filters */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                      : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Cards Grid - 3 Columns on desktop matching the screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredSkills.map((skill, index) => {
            const skillId = skill.id || skill._id || skill.name;
            const meta = SKILL_METADATA[skill.name] || {};
            
            const subtitle = isFrench 
              ? (meta.subtitleFr || skill.category)
              : (meta.subtitleEn || `Core ${skill.category}`);

            const description = skill.description || (isFrench ? meta.noteFr : meta.noteEn);
            const artType = skill.artType || meta.artType || ART_CYCLE[index % ART_CYCLE.length];
            const tags = meta.tags || [skill.category, `${skill.level || 90}% Proficiency`];
            const isExpanded = expandedSkillId === skillId;

            return (
              <div
                key={skillId}
                className={`relative bg-white dark:bg-[#18181b] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-neutral-200/70 dark:border-neutral-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                  isExpanded ? 'ring-2 ring-neutral-900/10 dark:ring-white/20' : ''
                }`}
              >
                {/* Top Half: Title & Subtitle on left, Description text on right */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1 pr-2">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                        {skill.name}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-neutral-400 dark:text-neutral-400 font-normal mt-1 leading-snug">
                        {subtitle}
                      </p>
                    </div>

                    {description && (
                      <div className="sm:max-w-[190px] md:max-w-[210px] text-left">
                        <p className="text-xs sm:text-[12.5px] text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed">
                          {description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Drawer: Revealed when + is clicked */}
                {isExpanded && (
                  <div className="my-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3 animate-fadeIn">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {isFrench ? 'Niveau d\'expertise' : 'Proficiency & Mastery'}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {skill.level || 90}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500" 
                          style={{ width: `${skill.level || 90}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Half: Geometric Line Art on left, Black circle plus button on right */}
                <div className="flex items-end justify-between pt-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <GeometricArt 
                      type={artType} 
                      className="w-full h-full text-neutral-900 dark:text-neutral-100" 
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(skillId)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm focus:outline-none"
                    aria-label={`Toggle details for ${skill.name}`}
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter footer */}
        <div className="mt-8 flex justify-center items-center">
          <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
            {filteredSkills.length} {filteredSkills.length > 1 ? (isFrench ? 'technologies affichées' : 'technologies displayed') : (isFrench ? 'technologie affichée' : 'technology displayed')}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Skills;
