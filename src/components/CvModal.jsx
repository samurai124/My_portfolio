import React, { useRef } from 'react';

export default function CvModal({ isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Curriculum Vitae"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#111114] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-500 text-lg">badge</span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Curriculum Vitae • Verified Profile
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity text-xs font-semibold cursor-pointer shadow-sm"
              title="Print or Save as PDF"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Download / Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
              aria-label="Close CV modal"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Canvas */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 md:p-12 overflow-y-auto space-y-8 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-[#111114]"
        >
          {/* Header Profile */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hamza Zaidi</h1>
              <p className="text-sm sm:text-base font-medium text-neutral-600 dark:text-neutral-300 mt-1">
                Full-Stack Web Developer • React, Spring Boot & Laravel
              </p>
              <p className="text-xs font-mono text-neutral-500 mt-2 flex items-center gap-3 flex-wrap">
                <span>📍 Casablanca, Morocco</span>
                <span>•</span>
                <span>⚡ Available for Full-Time & Freelance</span>
              </p>
            </div>

            <div className="text-xs font-mono space-y-1 sm:text-right text-neutral-500 dark:text-neutral-400">
              <div>
                <a href="mailto:hamza.zaidi.work@gmail.com" className="hover:underline text-neutral-700 dark:text-neutral-200 font-medium">
                  hamza.zaidi.work@gmail.com
                </a>
              </div>
              <div>github.com/hamzazaidi</div>
              <div>linkedin.com/in/hamzazaidi</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">01 / Profile Summary</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              Results-driven Full-Stack Software Developer with proven capability in architecting end-to-end web applications, high-throughput REST APIs, and responsive user interfaces. Expert across modern JavaScript/TypeScript ecosystems (React, Tailwind CSS, Vite) alongside enterprise backend systems (Java Spring Boot, PHP Laravel, PostgreSQL, Docker). Committed to clean architecture, testable code, CI/CD automation, and seamless user experiences.
            </p>
          </div>

          {/* Technical Skills Matrix */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">02 / Technical Competencies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">Frontend</h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
                  React 19, JavaScript (ES6+), TypeScript, Tailwind CSS, HTML5/CSS3, State Management (Context/Redux), Responsive UX.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">Backend</h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
                  Java Spring Boot, Spring Security, Hibernate/JPA, PHP Laravel, RESTful APIs, JWT Authentication, Microservices.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">Databases</h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
                  PostgreSQL, MySQL, Supabase, Redis, Schema Design, Query Optimization, Database Migration & Indexing.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">DevOps & Tools</h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
                  Docker, Git & GitHub, Linux environments, Postman, Vite, CI/CD pipelines, Vercel/Netlify hosting.
                </p>
              </div>
            </div>
          </div>

          {/* Key Projects & Experience */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">03 / Key Projects & Solutions</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-neutral-900 dark:border-white pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Full-Stack Portfolio Studio & Content CMS
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">React • Tailwind • Supabase • REST</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-normal">
                  Engineered an ultra-fast developer portfolio with custom administrative studio, real-time Morocco studio clock, dual-theme engine, and dynamic project filtering. Integrated complete CRUD operations with Supabase persistence.
                </p>
              </div>

              <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Enterprise SaaS & Management Platform
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">Spring Boot • React • PostgreSQL • Docker</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-normal">
                  Designed secure backend APIs using Spring Security and JWT token rotation. Configured relational database models in PostgreSQL with automated database migrations and Dockerized multi-stage container deployments.
                </p>
              </div>

              <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Scalable E-Commerce & Booking Architecture
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">Laravel • React • MySQL • Redis</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-normal">
                  Constructed checkout workflows, appointment booking scheduling, automated confirmation notifications, and an administrative order management console.
                </p>
              </div>
            </div>
          </div>

          {/* Education & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">04 / Education</h2>
              <div className="text-xs">
                <p className="font-bold text-neutral-900 dark:text-white">Degree in Software Engineering / Computer Science</p>
                <p className="text-neutral-500 font-mono mt-0.5">Focus on Object-Oriented Design, Web Technologies & Database Systems</p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">05 / Languages</h2>
              <div className="text-xs flex gap-4 text-neutral-600 dark:text-neutral-300">
                <div><span className="font-semibold text-neutral-900 dark:text-white">English:</span> Professional Working</div>
                <div><span className="font-semibold text-neutral-900 dark:text-white">French:</span> Professional Working</div>
                <div><span className="font-semibold text-neutral-900 dark:text-white">Arabic:</span> Native</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
