import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../services/api';

function AdminDashboard({ isOpen, onClose, user, onLogout, showToast, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, blogs, messages, bookings, security
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // File input refs
  const projectFileInputRef = useRef(null);
  const blogFileInputRef = useRef(null);

  // Data states
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Project Modal / Edit State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Java Spring Boot',
    tags: '',
    image: '/fleetflow.jpg',
    githubUrl: 'https://github.com',
    liveUrl: '',
    metrics: '',
    description: '',
    client: '',
    timeline: '2025',
    role: 'Lead Developer',
    challenge: '',
    solution: '',
    featured: true
  });

  // Blog Modal / Edit State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Architecture & Security',
    date: new Date().getFullYear().toString(),
    readTime: '6 min de lecture',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    summary: '',
    content: '',
    published: true
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, blogRes, msgRes, bookRes] = await Promise.allSettled([
        api.getProjects(),
        api.getBlogs('All', true),
        api.getMessages(),
        api.getBookings()
      ]);

      if (projRes.status === 'fulfilled' && projRes.value.data) setProjects(projRes.value.data);
      if (blogRes.status === 'fulfilled' && blogRes.value.data) setBlogs(blogRes.value.data);
      if (msgRes.status === 'fulfilled' && msgRes.value.data) setMessages(msgRes.value.data);
      if (bookRes.status === 'fulfilled' && bookRes.value.data) setBookings(bookRes.value.data);
    } catch {
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
    }
  }, [isOpen, fetchDashboardData]);

  if (!isOpen) return null;

  // ---------------- LOCAL FILE UPLOAD HANDLER ----------------
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('L\'image est trop volumineuse (maximum 10 Mo)', 'error');
      return;
    }

    setUploading(true);
    showToast('Upload de l\'image en cours...', 'info');

    try {
      const res = await api.uploadFile(file);
      if (res.success && res.data?.url) {
        const uploadedUrl = res.data.url;
        if (type === 'project') {
          setProjectForm(prev => ({ ...prev, image: uploadedUrl }));
        } else if (type === 'blog') {
          setBlogForm(prev => ({ ...prev, image: uploadedUrl }));
        }
        showToast('Image locale insérée avec succès !', 'success');
      } else {
        showToast('Échec de l\'upload de l\'image', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Erreur lors de l\'upload du fichier', 'error');
    } finally {
      setUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // ---------------- PROJECT ACTIONS ----------------
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Java Spring Boot',
      tags: 'Java, Spring Boot, Docker, REST API',
      image: '/fleetflow.jpg',
      githubUrl: 'https://github.com',
      liveUrl: '',
      metrics: 'Docker CI/CD, Auth JWT, REST API',
      description: '',
      client: 'Projet Client / Entreprise',
      timeline: '2025',
      role: 'Lead Full Stack',
      challenge: '',
      solution: '',
      featured: true
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'Java Spring Boot',
      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags || '',
      image: proj.image || '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      metrics: Array.isArray(proj.metrics) ? proj.metrics.join(', ') : proj.metrics || '',
      description: proj.description || '',
      client: proj.details?.client || '',
      timeline: proj.details?.timeline || '',
      role: proj.details?.role || '',
      challenge: proj.details?.challenge || '',
      solution: proj.details?.solution || '',
      featured: proj.featured ?? true
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: projectForm.title,
        category: projectForm.category,
        tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        image: projectForm.image,
        githubUrl: projectForm.githubUrl,
        liveUrl: projectForm.liveUrl,
        metrics: projectForm.metrics.split(',').map(m => m.trim()).filter(Boolean),
        description: projectForm.description,
        featured: projectForm.featured,
        details: {
          client: projectForm.client,
          timeline: projectForm.timeline,
          role: projectForm.role,
          challenge: projectForm.challenge,
          solution: projectForm.solution
        }
      };

      if (editingProject) {
        await api.updateProject(editingProject._id || editingProject.id, payload);
        showToast('Projet mis à jour avec succès !', 'success');
      } else {
        await api.createProject(payload);
        showToast('Nouveau projet ajouté avec succès !', 'success');
      }

      setProjectModalOpen(false);
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message || 'Erreur lors de la sauvegarde du projet', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    try {
      await api.deleteProject(id);
      showToast('Projet supprimé', 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  // ---------------- BLOG ACTIONS ----------------
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      category: 'Architecture & Security',
      date: new Date().getFullYear().toString(),
      readTime: '6 min de lecture',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
      summary: '',
      content: '',
      published: true
    });
    setBlogModalOpen(true);
  };

  const openEditBlogModal = (b) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title || '',
      category: b.category || 'Architecture & Security',
      date: b.date || '',
      readTime: b.readTime || '5 min',
      image: b.image || '',
      summary: b.summary || '',
      content: b.content || '',
      published: b.published ?? true
    });
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: blogForm.title,
        category: blogForm.category,
        date: blogForm.date,
        readTime: blogForm.readTime,
        image: blogForm.image,
        summary: blogForm.summary,
        content: blogForm.content,
        published: blogForm.published
      };

      if (editingBlog) {
        await api.updateBlog(editingBlog._id || editingBlog.id, payload);
        showToast('Article mis à jour !', 'success');
      } else {
        await api.createBlog(payload);
        showToast('Nouvel article publié !', 'success');
      }

      setBlogModalOpen(false);
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message || "Erreur d'enregistrement", 'error');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await api.deleteBlog(id);
      showToast('Article supprimé', 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  // ---------------- MESSAGE & BOOKING ACTIONS ----------------
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await api.deleteMessage(id);
      showToast('Message supprimé', 'info');
      fetchDashboardData();
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Supprimer cette réservation ?')) return;
    try {
      await api.deleteBooking(id);
      showToast('Réservation supprimée', 'info');
      fetchDashboardData();
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  // ---------------- PASSWORD UPDATE ----------------
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }
    try {
      await api.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast('Mot de passe mis à jour avec succès !', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message || 'Erreur lors du changement de mot de passe', 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: 'dashboard' },
    { id: 'projects', label: 'Projets', icon: 'deployed_code', count: projects.length },
    { id: 'blogs', label: 'Articles Blog', icon: 'article', count: blogs.length },
    { id: 'messages', label: 'Messages', icon: 'mail', count: messages.length },
    { id: 'bookings', label: 'Rendez-vous', icon: 'calendar_month', count: bookings.length },
    { id: 'security', label: 'Sécurité', icon: 'lock' }
  ];

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_rgba(2,6,23,0.94)_52%)] text-on-background animate-in fade-in duration-200">
      
      {/* Floating Header Navbar (Portfolio Bento Style) */}
      <header className="sticky top-0 z-40 px-4 md:px-8 pt-4 pb-3 bg-background/55 backdrop-blur-xl border-b border-outline-variant/25">
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-surface/90 border border-outline-variant/50 rounded-2xl md:rounded-full px-5 py-3 shadow-[0_10px_40px_rgba(2,6,23,0.35)]">
          
          {/* Brand & Live status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center">
              HZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">Studio Administrateur</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-medium border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Supabase
                </span>
              </div>
              <span className="text-[10px] text-on-surface-variant hidden sm:block">
                {user?.email || 'admin@portfolio.com'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 rounded-full border border-outline-variant/60 hover:border-primary text-on-surface-variant hover:text-primary transition-all cursor-pointer"
              title="Actualiser les données"
            >
              <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full border border-outline-variant/60 hover:border-primary text-xs font-medium text-primary hover:bg-surface-container transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">visibility</span>
              <span className="hidden sm:inline">Voir Portfolio</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">logout</span>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Studio Body Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Bento Tab Selector Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-surface/95 border border-outline-variant/50 rounded-2xl md:rounded-full shadow-sm w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/60'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ---------------- 1. OVERVIEW TAB ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 4 KPI Metrics Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-surface border border-outline-variant/50 rounded-3xl p-6 space-y-3 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="text-[10px] font-mono uppercase tracking-widest">[ Projets ]</span>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">deployed_code</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-3xl font-extrabold text-primary">{projects.length}</h3>
                  <p className="text-xs text-on-surface-variant font-light">Projets publiés dans le portfolio</p>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant/50 rounded-3xl p-6 space-y-3 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="text-[10px] font-mono uppercase tracking-widest">[ Articles ]</span>
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">article</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-3xl font-extrabold text-primary">{blogs.length}</h3>
                  <p className="text-xs text-on-surface-variant font-light">Articles techniques en ligne</p>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant/50 rounded-3xl p-6 space-y-3 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="text-[10px] font-mono uppercase tracking-widest">[ Messages ]</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-3xl font-extrabold text-primary">{messages.length}</h3>
                  <p className="text-xs text-on-surface-variant font-light">Demandes reçues via le formulaire</p>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant/50 rounded-3xl p-6 space-y-3 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="text-[10px] font-mono uppercase tracking-widest">[ Rendez-vous ]</span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-3xl font-extrabold text-primary">{bookings.length}</h3>
                  <p className="text-xs text-on-surface-variant font-light">Échanges planifiés</p>
                </div>
              </div>

            </div>

            {/* 2-Column Bento: Recent Messages & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Box: Recent Messages */}
              <div className="lg:col-span-7 bg-surface border border-outline-variant/50 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                      [ Inbox Récente ]
                    </span>
                    <h4 className="text-base font-bold text-primary">Derniers Messages</h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir tout</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-on-surface-variant font-light">
                    Aucun message reçu pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((m) => (
                      <div
                        key={m._id || m.id}
                        className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-primary">{m.name}</span>
                          <span className="text-[10px] font-mono text-on-surface-variant">{m.email}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-light line-clamp-2">
                          {m.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Box: Quick Shortcuts & Server Info */}
              <div className="lg:col-span-5 bg-surface border border-outline-variant/50 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                      [ Actions Rapides ]
                    </span>
                    <h4 className="text-base font-bold text-primary">Gestion Express</h4>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={openNewProjectModal}
                      className="w-full bg-surface-container-low hover:bg-surface-container p-3.5 rounded-2xl border border-outline-variant/40 text-xs font-semibold text-primary flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-base text-primary">add_circle</span>
                        <span>Publier un Nouveau Projet</span>
                      </div>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>

                    <button
                      onClick={openNewBlogModal}
                      className="w-full bg-surface-container-low hover:bg-surface-container p-3.5 rounded-2xl border border-outline-variant/40 text-xs font-semibold text-primary flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-base text-primary">edit_document</span>
                        <span>Rédiger un Article de Blog</span>
                      </div>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('security')}
                      className="w-full bg-surface-container-low hover:bg-surface-container p-3.5 rounded-2xl border border-outline-variant/40 text-xs font-semibold text-primary flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-base text-primary">password</span>
                        <span>Modifier Mot de Passe Admin</span>
                      </div>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30 text-[10px] font-mono text-on-surface-variant flex justify-between">
                  <span>Stack: React + Supabase</span>
                  <span className="text-emerald-500 font-bold">● Opérationnel</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------------- 2. PROJECTS TAB ---------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                  [ Portfolio Management ]
                </span>
                <h3 className="text-xl font-bold text-primary">Gestion des Projets ({projects.length})</h3>
              </div>

              <button
                onClick={openNewProjectModal}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 hover:scale-105 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Ajouter un Projet</span>
              </button>
            </div>

            {/* Projects 3-Column Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj._id || proj.id}
                  className="bg-surface border border-outline-variant/50 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 relative">
                      <img
                        src={proj.image || '/fleetflow.jpg'}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                        {proj.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-primary leading-snug">{proj.title}</h4>
                    <p className="text-xs text-on-surface-variant font-light line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Tags */}
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-surface-container rounded-full text-on-surface-variant">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                    <button
                      onClick={() => openEditProjectModal(proj)}
                      className="px-3.5 py-1.5 rounded-full border border-outline-variant/60 hover:border-primary text-xs font-semibold text-primary hover:bg-surface-container transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Modifier</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProject(proj._id || proj.id)}
                      className="w-8 h-8 rounded-full border border-red-500/30 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Supprimer"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ---------------- 3. BLOGS TAB ---------------- */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                  [ Articles &amp; Insights ]
                </span>
                <h3 className="text-xl font-bold text-primary">Articles du Blog ({blogs.length})</h3>
              </div>

              <button
                onClick={openNewBlogModal}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 hover:scale-105 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Nouvel Article</span>
              </button>
            </div>

            {/* Blogs 3-Column Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((b) => (
                <div
                  key={b._id || b.id}
                  className="bg-surface border border-outline-variant/50 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/10] bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 relative">
                      <img
                        src={b.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                        {b.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>{b.readTime}</span>
                    </div>

                    <h4 className="text-sm font-bold text-primary leading-snug">{b.title}</h4>
                    <p className="text-xs text-on-surface-variant font-light line-clamp-2 leading-relaxed">
                      {b.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                    <button
                      onClick={() => openEditBlogModal(b)}
                      className="px-3.5 py-1.5 rounded-full border border-outline-variant/60 hover:border-primary text-xs font-semibold text-primary hover:bg-surface-container transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Modifier</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBlog(b._id || b.id)}
                      className="w-8 h-8 rounded-full border border-red-500/30 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Supprimer"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ---------------- 4. MESSAGES TAB ---------------- */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                [ Formulaire de Contact ]
              </span>
              <h3 className="text-xl font-bold text-primary">Boîte de Réception ({messages.length})</h3>
            </div>

            {messages.length === 0 ? (
              <div className="bg-surface border border-outline-variant/50 rounded-3xl p-12 text-center text-xs text-on-surface-variant font-light">
                Aucun message reçu pour l'instant.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m._id || m.id}
                    className="bg-surface border border-outline-variant/50 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-primary">{m.name}</h4>
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                          {m.projectType || 'Full Stack'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          {new Date(m.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-primary/80 font-mono block">{m.email}</span>
                      <p className="text-xs text-on-surface-variant font-light leading-relaxed pt-1">
                        {m.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`mailto:${m.email}?subject=Re: Votre demande sur mon Portfolio`}
                        className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-xs">reply</span>
                        <span>Répondre</span>
                      </a>
                      <button
                        onClick={() => handleDeleteMessage(m._id || m.id)}
                        className="w-8 h-8 rounded-full border border-red-500/30 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- 5. BOOKINGS TAB ---------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                [ Échanges &amp; Calls ]
              </span>
              <h3 className="text-xl font-bold text-primary">Rendez-vous Planifiés ({bookings.length})</h3>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-surface border border-outline-variant/50 rounded-3xl p-12 text-center text-xs text-on-surface-variant font-light">
                Aucun rendez-vous planifié pour l'instant.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div
                    key={b._id || b.id}
                    className="bg-surface border border-outline-variant/50 rounded-3xl p-6 flex justify-between items-center shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
                        <h4 className="text-xs font-bold text-primary">{b.name}</h4>
                      </div>
                      <span className="text-xs text-primary/80 font-mono block">{b.email}</span>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                          📅 {b.date}
                        </span>
                        <span className="text-[11px] font-mono bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant font-bold">
                          ⏰ {b.slot}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${b.email}?subject=Confirmation Rendez-vous Portfolio`}
                        className="p-2 rounded-full border border-outline-variant/60 hover:border-primary text-primary transition-all"
                        title="Envoyer un email"
                      >
                        <span className="material-symbols-outlined text-sm">mail</span>
                      </a>
                      <button
                        onClick={() => handleDeleteBooking(b._id || b.id)}
                        className="p-2 rounded-full border border-red-500/30 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- 6. SECURITY TAB ---------------- */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto bg-surface border border-outline-variant/50 rounded-3xl p-7 md:p-9 space-y-6 shadow-sm animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block mb-1">
                [ Paramètres du Compte ]
              </span>
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shield</span>
                Sécurité &amp; Mot de Passe
              </h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block font-semibold">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block font-semibold">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Minimum 6 caractères"
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block font-semibold">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] shadow-md"
                >
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                  <span>Mettre à jour le mot de passe</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ---------------- PROJECT ADD / EDIT MODAL (WITH LOCAL FILE UPLOAD) ---------------- */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface border border-outline-variant/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7 md:p-9 rounded-3xl shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setProjectModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full border border-outline-variant/60 hover:border-primary flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                [ Studio Form ]
              </span>
              <h3 className="text-xl font-bold text-primary">
                {editingProject ? 'Modifier le Projet' : 'Ajouter un Nouveau Projet'}
              </h3>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Titre du Projet *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="Ex: FleetFlow – API Logistique"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Catégorie *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  >
                    <option value="Java Spring Boot">Java Spring Boot</option>
                    <option value="Laravel & React">Laravel &amp; React</option>
                    <option value="Microservices">Microservices</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
              </div>

              {/* LOCAL IMAGE UPLOAD BOX */}
              <div className="space-y-2 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">image</span>
                    <span>Image / Mockup du Projet</span>
                  </label>
                  <span className="text-[10px] text-on-surface-variant font-mono">JPG, PNG, WEBP (Max 10Mo)</span>
                </div>

                {/* Live Image Preview + Upload Trigger */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {projectForm.image && (
                    <div className="w-32 h-20 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/50 shrink-0 shadow-sm">
                      <img
                        src={projectForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/fleetflow.jpg'; }}
                      />
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={projectFileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      onChange={(e) => handleFileUpload(e, 'project')}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => projectFileInputRef.current?.click()}
                      className="w-full bg-surface border border-outline-variant/60 hover:border-primary p-2.5 rounded-xl text-xs font-semibold text-primary flex items-center justify-center gap-2 hover:bg-surface-container transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                          <span>Upload en cours...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
                          <span>📁 Choisir une image depuis l'ordinateur</span>
                        </>
                      )}
                    </button>

                    <input
                      type="text"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="Ou collez une URL: /fleetflow.jpg ou https://..."
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl p-2 text-[11px] text-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Tags (séparés par virgule)</label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    placeholder="Java, Spring Boot, Docker, JWT"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Métriques Clés (séparées par virgule)</label>
                  <input
                    type="text"
                    value={projectForm.metrics}
                    onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                    placeholder="Docker CI/CD, Auth JWT, REST API"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Lien GitHub</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Lien Démo Live (optionnel)</label>
                  <input
                    type="text"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://mon-projet.com"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Description Résumée *</label>
                <textarea
                  rows={2}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Brève description pour la carte du portfolio..."
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Défi &amp; Contexte (Modale)</label>
                  <textarea
                    rows={2}
                    value={projectForm.challenge}
                    onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })}
                    placeholder="Problématique technique à résoudre..."
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Solution Implémentée (Modale)</label>
                  <textarea
                    rows={2}
                    value={projectForm.solution}
                    onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                    placeholder="Choix d'architecture, DTOs, sécurité, Docker..."
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-outline-variant/60 hover:border-primary text-xs font-semibold text-primary transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  {editingProject ? 'Enregistrer les Modifications' : 'Créer le Projet'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ---------------- BLOG ADD / EDIT MODAL (WITH LOCAL FILE UPLOAD) ---------------- */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface border border-outline-variant/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7 md:p-9 rounded-3xl shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setBlogModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full border border-outline-variant/60 hover:border-primary flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block">
                [ Studio Blog ]
              </span>
              <h3 className="text-xl font-bold text-primary">
                {editingBlog ? "Modifier l'Article" : 'Rédiger un Nouvel Article'}
              </h3>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Titre de l'Article *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="Ex: Conception d'une API REST avec Spring Boot"
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Catégorie *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    placeholder="Architecture & Security"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Date</label>
                  <input
                    type="text"
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    placeholder="2025"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Temps de Lecture</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="6 min de lecture"
                    className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* LOCAL BLOG COVER IMAGE UPLOAD BOX */}
              <div className="space-y-2 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">image</span>
                    <span>Image d'illustration de l'Article</span>
                  </label>
                  <span className="text-[10px] text-on-surface-variant font-mono">JPG, PNG, WEBP (Max 10Mo)</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {blogForm.image && (
                    <div className="w-32 h-20 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/50 shrink-0 shadow-sm">
                      <img
                        src={blogForm.image}
                        alt="Blog Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'; }}
                      />
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={blogFileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      onChange={(e) => handleFileUpload(e, 'blog')}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => blogFileInputRef.current?.click()}
                      className="w-full bg-surface border border-outline-variant/60 hover:border-primary p-2.5 rounded-xl text-xs font-semibold text-primary flex items-center justify-center gap-2 hover:bg-surface-container transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                          <span>Upload en cours...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
                          <span>📁 Choisir une image depuis l'ordinateur</span>
                        </>
                      )}
                    </button>

                    <input
                      type="text"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      placeholder="Ou collez une URL: https://images.unsplash.com/..."
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl p-2 text-[11px] text-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Résumé de l'Article *</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Court résumé affiché sur la carte du portfolio..."
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-on-surface-variant font-semibold">Contenu Complet de l'Article *</label>
                <textarea
                  rows={6}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Rédigez ici le corps de votre article technique..."
                  className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-outline-variant/60 hover:border-primary text-xs font-semibold text-primary transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  {editingBlog ? 'Enregistrer les Modifications' : "Publier l'Article"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
