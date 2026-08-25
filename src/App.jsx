import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Blog from './components/Blog';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import ContactModal from './components/ContactModal';
import BlogDetailModal from './components/BlogDetailModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboard from './components/admin/AdminDashboard';
import api from './services/api';
import './App.css';

const portfolioCopy = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      skills: "Skills",
      services: "Services",
      about: "About",
      blog: "Blog",
      cv: "CV",
      studio: "Studio",
      contact: "Contact",
      openCv: "Open CV",
      openStudio: "Open admin studio",
      changeLanguage: "Change language"
    },
    hero: {
      roleLabel: "Expert Role",
      roleLine1: "Full-Stack Web Developer",
      roleLine2: "React, Spring Boot & Laravel",
      locationLabel: "Location",
      location: "Based in Morocco",
      availabilityLabel: "Availability",
      availability: "Open to Opportunities",
      headline: "I build complete web applications, from clean React interfaces to secure APIs, databases, authentication, Docker deployment, and CI/CD workflows."
    },
    projects: {
      kicker: "[ Portfolio ]",
      title: "Selected Works",
      description: "Explore practical full-stack work areas, from React interfaces to backend APIs, authentication, databases, and deployment workflows.",
      empty: "No projects match the selected filter.",
      filters: { all: "All" }
    },
    skills: {
      kicker: "[ Technical Stack ]",
      title: "Skills & Expertise",
      description: "A comprehensive overview of programming languages, frameworks, databases, and deployment tools I use to build scalable web applications.",
      filters: { all: "All", tools: "Tools & Workflow" }
    },
    services: {
      kicker: "[ Capabilities ]",
      title: "Best Services",
      description: "I build practical web solutions from interface to database, with clean code, secure APIs, and deployment-ready workflows."
    },
    about: {
      kicker: "[ Background ]",
      title: "About Hamza",
      intro: "Full-Stack Web Developer based in Morocco, with practical experience designing and deploying complete applications, from data modeling and authentication to containerization and continuous integration.",
      stats: { api: "REST Services", databases: "Databases", deployment: "Deployment" },
      body1: "Able to design robust multi-layer architectures independently, including secure REST APIs, role management, migrations, and CI/CD with Spring Boot and Laravel, then connect them to modern React interfaces.",
      body2: "Looking for an opportunity to apply this technical autonomy on useful projects while continuing to deepen my software architecture skills.",
      focusTitle: "Technical Focus",
      focusItems: [
        { role: "Frontend Development", company: "React", period: "UI", desc: "Building responsive interfaces with reusable components, clean layouts, and smooth user interactions." },
        { role: "Backend Development", company: "Spring Boot & Laravel", period: "API", desc: "Creating REST APIs with authentication, role management, validation, and structured database access." },
        { role: "Delivery Workflow", company: "Docker & CI/CD", period: "Deploy", desc: "Preparing applications for deployment with containerization, migrations, and automated integration workflows." }
      ]
    },
    focus: {
      kicker: "[ Focus ]",
      title: "How I Work",
      description: "A quick look at the development approach and technical values behind my full-stack projects."
    },
    faq: {
      kicker: "[ Inquiries ]",
      title: "FAQ",
      description: "Common questions about my workflow, stack, and full-stack development approach."
    },
    blog: {
      kicker: "[ Writings ]",
      title: "Code & Context",
      description: "Occasional thoughts on technical architecture, developer productivity, and the future of the web."
    },
    cta: {
      title: "Have a technical challenge in mind?",
      description: "Let's arrange a 15-minute alignment call to map out your project needs and the best solution path.",
      button: "Book a tech strategy call",
      direct: "Direct Inquiry",
      linkedin: "LinkedIn Profile",
      viewCv: "View CV"
    },
    footer: {
      description: "Full-Stack Web Developer focused on React interfaces, secure APIs, databases, Docker, and CI/CD.",
      pages: "Main Pages",
      writings: "Writings",
      blogArticles: "Blog Articles",
      faqs: "FAQs",
      connect: "Connect",
      viewCv: "View CV",
      rights: "All Rights Reserved."
    },
    contact: {
      heading: "Work with Hamza",
      subheading: "Let's discuss your website or app idea.",
      messageTab: "Send a Message",
      callTab: "Book Strategy Call",
      successTitle: "Message Received!",
      successText: "Thank you for reaching out. Hamza will review your requirements and respond back via email in under 24 hours.",
      nameLabel: "Your Name *",
      namePlaceholder: "e.g. Your name",
      emailLabel: "Your Email *",
      emailPlaceholder: "e.g. you@company.com",
      projectType: "Project Type",
      briefLabel: "Your Brief *",
      briefPlaceholder: "Tell me about your project, timeline, features, or technical needs...",
      send: "Send Message",
      book: "Book 15-Min Strategic Call"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      skills: "Compétences",
      services: "Services",
      about: "Profil",
      blog: "Blog",
      cv: "CV",
      studio: "Studio",
      contact: "Contact",
      openCv: "Ouvrir le CV",
      openStudio: "Ouvrir le studio admin",
      changeLanguage: "Changer de langue"
    },
    hero: {
      roleLabel: "Role",
      roleLine1: "Developpeur Web Full-Stack",
      roleLine2: "React, Spring Boot & Laravel",
      locationLabel: "Localisation",
      location: "Base au Maroc",
      availabilityLabel: "Disponibilite",
      availability: "Ouvert aux opportunites",
      headline: "Je cree des applications web completes, des interfaces React propres aux APIs securisees, bases de donnees, authentification, Docker et workflows CI/CD."
    },
    projects: {
      kicker: "[ Portfolio ]",
      title: "Travaux Selectionnes",
      description: "Decouvrez mes axes de travail full-stack: interfaces React, APIs backend, authentification, bases de donnees et deploiement.",
      empty: "Aucun projet ne correspond au filtre selectionne.",
      filters: { all: "Tous" }
    },
    skills: {
      kicker: "[ Stack Technique ]",
      title: "Compétences & Outils",
      description: "Un aperçu complet des langages de programmation, frameworks, bases de données et outils de déploiement que j'utilise pour concevoir des applications web robustes.",
      filters: { all: "Tous", tools: "Outils & Workflow" }
    },
    services: {
      kicker: "[ Services ]",
      title: "Services",
      description: "Je construis des solutions web pratiques, de l'interface a la base de donnees, avec du code clair, des APIs securisees et des workflows prets pour le deploiement."
    },
    about: {
      kicker: "[ Parcours ]",
      title: "A propos de Hamza",
      intro: "Developpeur Web Full Stack base au Maroc, avec une experience pratique dans la conception et le deploiement d'applications completes, de la modelisation des donnees a l'authentification jusqu'a la mise en conteneur et l'integration continue.",
      stats: { api: "Services REST", databases: "Bases de donnees", deployment: "Deploiement" },
      body1: "Capable de concevoir seul des architectures multicouches robustes, avec API REST securisees, gestion des roles, migrations et CI/CD via Spring Boot et Laravel, puis de les connecter a des interfaces React modernes.",
      body2: "Je recherche une opportunite ou mettre a profit cette autonomie technique sur des projets utiles, tout en continuant a approfondir mon expertise en architecture logicielle.",
      focusTitle: "Axes Techniques",
      focusItems: [
        { role: "Developpement Frontend", company: "React", period: "UI", desc: "Creation d'interfaces responsives avec composants reutilisables, mise en page claire et interactions fluides." },
        { role: "Developpement Backend", company: "Spring Boot & Laravel", period: "API", desc: "Creation d'APIs REST avec authentification, gestion des roles, validation et acces structure aux donnees." },
        { role: "Workflow de Livraison", company: "Docker & CI/CD", period: "Deploy", desc: "Preparation des applications au deploiement avec conteneurisation, migrations et integration continue." }
      ]
    },
    focus: {
      kicker: "[ Approche ]",
      title: "Ma Facon de Travailler",
      description: "Un apercu de mon approche de developpement et des valeurs techniques derriere mes projets full-stack."
    },
    faq: {
      kicker: "[ Questions ]",
      title: "FAQ",
      description: "Questions frequentes sur mon workflow, ma stack et mon approche du developpement full-stack."
    },
    blog: {
      kicker: "[ Articles ]",
      title: "Code & Contexte",
      description: "Quelques idees sur l'architecture technique, la productivite developpeur et l'evolution du web."
    },
    cta: {
      title: "Un defi technique en tete ?",
      description: "Planifions un echange de 15 minutes pour clarifier vos besoins et choisir la meilleure piste de solution.",
      button: "Planifier un appel technique",
      direct: "Contact direct",
      linkedin: "Profil LinkedIn",
      viewCv: "Voir le CV"
    },
    footer: {
      description: "Developpeur Web Full-Stack specialise en interfaces React, APIs securisees, bases de donnees, Docker et CI/CD.",
      pages: "Pages",
      writings: "Articles",
      blogArticles: "Articles du blog",
      faqs: "FAQs",
      connect: "Contact",
      viewCv: "Voir le CV",
      rights: "Tous droits reserves."
    },
    contact: {
      heading: "Travailler avec Hamza",
      subheading: "Parlons de votre site web ou application.",
      messageTab: "Envoyer un message",
      callTab: "Planifier un appel",
      successTitle: "Message recu !",
      successText: "Merci pour votre message. Hamza va consulter vos besoins et vous repondre par email sous 24 heures.",
      nameLabel: "Votre nom *",
      namePlaceholder: "ex. Votre nom",
      emailLabel: "Votre email *",
      emailPlaceholder: "ex. vous@entreprise.com",
      projectType: "Type de projet",
      briefLabel: "Votre brief *",
      briefPlaceholder: "Parlez-moi du projet, du timing, des fonctionnalites ou des besoins techniques...",
      send: "Envoyer",
      book: "Planifier un appel de 15 min"
    }
  }
};

function App() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const copy = portfolioCopy[language] || portfolioCopy.en;

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // default dark theme as in the template
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [contactOpen, setContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("message"); // message or call
  const [selectedProject, setSelectedProject] = useState(null);
  const [openFaqs, setOpenFaqs] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Contact Message form state
  const [messageForm, setMessageForm] = useState({ name: '', email: '', projectType: 'Full-Stack Web App', message: '' });
  const [messageFormErrors, setMessageFormErrors] = useState({});
  const [messageFormSuccess, setMessageFormSuccess] = useState(false);

  // Call Booking form state
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', date: '', slot: '' });
  const [bookingFormErrors, setBookingFormErrors] = useState({});
  const [bookingFormSuccess, setBookingFormSuccess] = useState(false);

  const testimonialsContainerRef = useRef(null);

  const normalizeProject = (project) => ({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : [],
    details: project.details || {
      client: '',
      timeline: '',
      role: '',
      challenge: '',
      solution: ''
    }
  });

  const normalizeService = (service) => ({
    ...service,
    images: Array.isArray(service.images) ? service.images : []
  });

  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3500);
  };

  const loadDynamicContent = async () => {
    try {
      const [projectsRes, skillsRes, servicesRes, testimonialsRes, faqsRes, blogsRes] = await Promise.allSettled([
        api.getProjects(),
        api.getSkills('All'),
        api.getServices(),
        api.getTestimonials(),
        api.getFaqs(),
        api.getBlogs('All')
      ]);

      if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value.data) && projectsRes.value.data.length > 0) {
        setProjects(projectsRes.value.data.map(normalizeProject));
      }
      if (skillsRes.status === 'fulfilled' && Array.isArray(skillsRes.value.data) && skillsRes.value.data.length > 0) {
        setSkills(skillsRes.value.data);
      }
      if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value.data) && servicesRes.value.data.length > 0) {
        setServices(servicesRes.value.data.map(normalizeService));
      }
      if (testimonialsRes.status === 'fulfilled' && Array.isArray(testimonialsRes.value.data) && testimonialsRes.value.data.length > 0) {
        setTestimonials(testimonialsRes.value.data);
      }
      if (faqsRes.status === 'fulfilled' && Array.isArray(faqsRes.value.data) && faqsRes.value.data.length > 0) {
        setFaqs(faqsRes.value.data);
      }
      if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value.data) && blogsRes.value.data.length > 0) {
        setBlogs(blogsRes.value.data);
      }
    } catch (error) {
      console.error('Failed to load dynamic portfolio data:', error);
    }
  };

  useEffect(() => {
    loadDynamicContent();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const restoreAdminSession = async () => {
      try {
        const me = await api.getMe();
        if (me?.data) {
          setAdminUser(me.data);
        }
      } catch {
        setAdminUser(null);
      }
    };

    restoreAdminSession();
  }, []);

  useEffect(() => {
    const syncAdminHashRoute = () => {
      const isAdminRoute = window.location.hash === '#admin';
      if (!isAdminRoute) {
        setAdminDashboardOpen(false);
        return;
      }

      if (adminUser) {
        setAdminDashboardOpen(true);
      } else {
        setAdminLoginOpen(true);
      }
    };

    syncAdminHashRoute();
    window.addEventListener('hashchange', syncAdminHashRoute);

    return () => {
      window.removeEventListener('hashchange', syncAdminHashRoute);
    };
  }, [adminUser]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle active navigation item on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "skills", "services", "about", "blog"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!messageForm.name.trim()) errors.name = "Name is required";
    if (!messageForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(messageForm.email)) {
      errors.email = "Invalid email format";
    }
    if (!messageForm.message.trim()) errors.message = "Message cannot be empty";

    if (Object.keys(errors).length > 0) {
      setMessageFormErrors(errors);
    } else {
      try {
        await api.sendMessage(messageForm);
        setMessageFormErrors({});
        setMessageFormSuccess(true);
        setTimeout(() => {
          setMessageForm({ name: '', email: '', projectType: 'Full-Stack Web App', message: '' });
          setMessageFormSuccess(false);
          setContactOpen(false);
        }, 2500);
      } catch (error) {
        setMessageFormErrors({
          submit: error.message || 'Failed to send message. Please try again.'
        });
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!bookingForm.name.trim()) errors.name = "Name is required";
    if (!bookingForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) {
      errors.email = "Invalid email format";
    }
    if (!bookingForm.date) errors.date = "Please select a date";
    if (!bookingForm.slot) errors.slot = "Please select a time slot";

    if (Object.keys(errors).length > 0) {
      setBookingFormErrors(errors);
    } else {
      try {
        await api.sendBooking(bookingForm);
        setBookingFormErrors({});
        setBookingFormSuccess(true);
        setTimeout(() => {
          setBookingForm({ name: '', email: '', date: '', slot: '' });
          setBookingFormSuccess(false);
          setContactOpen(false);
        }, 2500);
      } catch (error) {
        setBookingFormErrors({
          submit: error.message || 'Failed to book the call. Please try again.'
        });
      }
    }
  };

  // Generate date slots for scheduling (next 5 working days)
  const getUpcomingDates = () => {
    const dates = [];
    let count = 0;
    const now = new Date();
    while (count < 5) {
      now.setDate(now.getDate() + 1);
      // Skip weekends
      if (now.getDay() !== 0 && now.getDay() !== 6) {
        dates.push(new Date(now));
        count++;
      }
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();
  const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  const scrollTestimonials = (direction) => {
    const container = testimonialsContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openAdminStudio = () => {
    window.location.hash = 'admin';
    if (adminUser) {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (data) => {
    const user = data?.user || data || null;
    setAdminUser(user);
    setAdminLoginOpen(false);
    setAdminDashboardOpen(true);
    window.location.hash = 'admin';
  };

  const handleAdminLogout = async () => {
    try {
      await api.logout();
      setAdminUser(null);
      setAdminDashboardOpen(false);
      setAdminLoginOpen(false);
      if (window.location.hash === '#admin') {
        window.location.hash = 'home';
      }
      showToast('Session administrateur fermée', 'info');
    } catch (error) {
      showToast(error.message || 'Erreur lors de la déconnexion', 'error');
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen transition-colors duration-300 antialiased">
      {/* Navigation Header */}
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        setContactOpen={setContactOpen} 
        setActiveTab={setActiveTab}
        activeSection={activeSection}
        onOpenAdmin={openAdminStudio}
        language={language}
        setLanguage={setLanguage}
        copy={copy}
      />

      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <Hero copy={copy} />

        {/* Selected Works Portfolio */}
        <Projects 
          projects={projects}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setSelectedProject={setSelectedProject}
          copy={copy}
        />

        {/* Technical Skills & Expertise */}
        <Skills 
          skills={skills} 
          copy={copy} 
        />

        {/* Capabilities Services */}
        <Services services={services} copy={copy} />

        {/* Background About Hamza */}
        <About copy={copy} />

        {/* Client Reviews / Testimonials */}
        <Testimonials 
          testimonials={testimonials}
          testimonialsContainerRef={testimonialsContainerRef}
          scrollTestimonials={scrollTestimonials}
          copy={copy}
        />

        {/* Dynamic Accordion FAQ */}
        <Faq 
          faqs={faqs}
          openFaqs={openFaqs}
          toggleFaq={toggleFaq}
          copy={copy}
        />

        {/* Technical Blog Writings */}
        <Blog 
          blogs={blogs}
          setSelectedBlog={setSelectedBlog}
          copy={copy}
        />

        {/* Call to Action Section */}
        <section className="px-4 md:px-margin-edge py-12 md:py-20 border-t border-outline-variant/30 bg-surface-container-lowest/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-xl text-xs sm:text-sm">
              <h2 className="font-headline-lg text-xl md:text-2xl mb-3 text-on-surface font-bold">{copy.cta.title}</h2>
              <p className="text-on-surface-variant mb-5">
                {copy.cta.description}
              </p>
              <button 
                onClick={() => {
                  setActiveTab("call");
                  setContactOpen(true);
                }}
                className="bg-primary text-on-primary px-6 py-3 rounded-none font-label-sm text-[10px] hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest cursor-pointer"
              >
                {copy.cta.button} →
              </button>
            </div>
            <div className="w-full md:w-auto text-left md:text-right">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.cta.direct}</span>
              <a 
                className="font-display-xl text-2xl sm:text-3xl md:text-4xl text-primary hover:underline hover:opacity-80 transition-all break-all tracking-tight font-extrabold" 
                href="mailto:hamzazaidi253@gmail.com"
              >
                hamzazaidi253@gmail.com ↗
              </a>
              <a
                className="block mt-2 text-on-surface-variant hover:text-primary transition-colors text-sm"
                href="tel:0626640792"
              >
                0626640792
              </a>
              <a
                className="block mt-1 text-on-surface-variant hover:text-primary transition-colors text-sm"
                href="https://www.linkedin.com/in/hamza-zaidi-b2a6b7351"
                target="_blank"
                rel="noreferrer"
              >
                {copy.cta.linkedin}
              </a>
              <a
                className="inline-flex mt-3 items-center gap-1.5 bg-sky-500/15 border border-sky-400/45 text-sky-300 px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-semibold hover:bg-sky-500 hover:text-white transition-all"
                href="https://docs.google.com/document/d/1ODKpVIIGCXNVGsjxuZ6ZHz4bE8-KjTEwVXayTTfWFQI/edit?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                <span>{copy.cta.viewCv}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <Footer copy={copy} />

      {/* MODALS */}
      <ProjectDetailModal 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <ContactModal 
        contactOpen={contactOpen}
        setContactOpen={setContactOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messageForm={messageForm}
        setMessageForm={setMessageForm}
        messageFormErrors={messageFormErrors}
        messageFormSuccess={messageFormSuccess}
        handleMessageSubmit={handleMessageSubmit}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        bookingFormErrors={bookingFormErrors}
        bookingFormSuccess={bookingFormSuccess}
        handleBookingSubmit={handleBookingSubmit}
        upcomingDates={upcomingDates}
        timeSlots={timeSlots}
        copy={copy}
      />

      <BlogDetailModal 
        selectedBlog={selectedBlog}
        setSelectedBlog={setSelectedBlog}
      />

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => {
          setAdminLoginOpen(false);
          if (window.location.hash === '#admin' && !adminUser) {
            window.location.hash = 'home';
          }
        }}
        onLoginSuccess={handleAdminLoginSuccess}
        showToast={showToast}
      />

      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => {
          setAdminDashboardOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = 'home';
          }
        }}
        user={adminUser}
        onLogout={handleAdminLogout}
        showToast={showToast}
        onRefreshData={loadDynamicContent}
      />

      <div className="fixed right-4 top-20 z-[70] space-y-2 w-[290px] max-w-[80vw] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl border text-xs shadow-xl backdrop-blur-md animate-in slide-in-from-right-4 fade-in duration-300 ${
              toast.type === 'error'
                ? 'bg-red-500/15 border-red-500/35 text-red-200'
                : toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                : 'bg-slate-900/75 border-white/15 text-slate-100'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
