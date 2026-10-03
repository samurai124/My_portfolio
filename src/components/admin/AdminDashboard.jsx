import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '../../services/api';

function AdminDashboard({ isOpen, onClose, user, onLogout, showToast, onRefreshData }) {
  // Navigation / Active View
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'skills', 'messages', 'bookings', 'security'
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live Studio Clock State (matching TimeSpot in screenshot)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [viewMetricMode, setViewMetricMode] = useState(false); // toggle between Live Clock & Big Metric

  // File input refs
  const projectFileInputRef = useRef(null);
  const blogFileInputRef = useRef(null);

  // Data states
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Category filters
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [skillsCategoryFilter, setSkillsCategoryFilter] = useState('All');
  const [subScheduleTab, setSubScheduleTab] = useState('bookings'); // 'bookings' or 'blogs'

  // Skills Modal / Edit State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend',
    level: 90,
    icon: 'code',
    featured: true,
    sort_order: 1
  });

  // Project Modal / Edit State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Java Spring Boot',
    tags: 'React, Spring Boot, Docker, REST API',
    image: '',
    githubUrl: 'https://github.com',
    liveUrl: '',
    metrics: 'Auth JWT, Docker CI/CD, REST API',
    description: '',
    client: 'Client Production',
    timeline: '2025',
    role: 'Lead Full-Stack Developer',
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
    readTime: '6 min read',
    image: '',
    summary: '',
    content: '',
    published: true
  });

  const backupFileInputRef = useRef(null);

  // Password Form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Live Clock Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Escape key listener to close studio
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !projectModalOpen && !skillModalOpen && !blogModalOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, projectModalOpen, skillModalOpen, blogModalOpen]);

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, blogRes, skillRes, msgRes, bookRes] = await Promise.allSettled([
        api.getProjects(),
        api.getBlogs('All', true),
        api.getSkills('All'),
        api.getMessages(),
        api.getBookings()
      ]);

      if (projRes.status === 'fulfilled' && projRes.value?.data) setProjects(projRes.value.data);
      if (blogRes.status === 'fulfilled' && blogRes.value?.data) setBlogs(blogRes.value.data);
      if (skillRes.status === 'fulfilled' && skillRes.value?.data) setSkills(skillRes.value.data);
      if (msgRes.status === 'fulfilled' && msgRes.value?.data) setMessages(msgRes.value.data);
      if (bookRes.status === 'fulfilled' && bookRes.value?.data) setBookings(bookRes.value.data);
    } catch {
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
    }
  }, [isOpen, fetchDashboardData]);

  // ---------------- FILE UPLOAD HANDLER ----------------
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image is too large (maximum 10MB)', 'error');
      return;
    }

    setUploading(true);
    showToast('Uploading image...', 'info');

    try {
      const res = await api.uploadFile(file);
      if (res.success && res.data?.url) {
        const uploadedUrl = res.data.url;
        if (type === 'project') {
          setProjectForm(prev => ({ ...prev, image: uploadedUrl }));
        } else if (type === 'blog') {
          setBlogForm(prev => ({ ...prev, image: uploadedUrl }));
        }
        showToast('Image uploaded successfully!', 'success');
      } else {
        throw new Error('Supabase storage fallback');
      }
    } catch {
      // Robust offline / local fallback using Data URL
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target.result;
        if (type === 'project') {
          setProjectForm(prev => ({ ...prev, image: dataUrl }));
        } else if (type === 'blog') {
          setBlogForm(prev => ({ ...prev, image: dataUrl }));
        }
        showToast('Image loaded and ready for save!', 'success');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ---------------- BACKUP & EXPORT ----------------
  const handleExportBackup = () => {
    try {
      const backupData = {
        appName: 'Hamza Zaidi Portfolio Studio',
        exportedAt: new Date().toISOString(),
        projects,
        skills,
        messages,
        bookings,
        blogs
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `portfolio-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('✓ Full portfolio backup exported!', 'success');
    } catch {
      showToast('Error exporting portfolio backup', 'error');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.projects && Array.isArray(data.projects)) setProjects(data.projects);
        if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
        if (data.blogs && Array.isArray(data.blogs)) setBlogs(data.blogs);
        if (data.bookings && Array.isArray(data.bookings)) setBookings(data.bookings);
        if (data.messages && Array.isArray(data.messages)) setMessages(data.messages);
        showToast('✓ Backup imported into studio workspace!', 'success');
      } catch {
        showToast('Invalid backup JSON file', 'error');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // ---------------- PROJECT ACTIONS ----------------
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Java Spring Boot',
      tags: 'Java, Spring Boot, Docker, REST API',
      image: '',
      githubUrl: 'https://github.com',
      liveUrl: '',
      metrics: 'Docker CI/CD, Auth JWT, REST API',
      description: '',
      client: 'Client Production',
      timeline: '2025',
      role: 'Lead Full-Stack Developer',
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
      githubUrl: proj.githubUrl || proj.github_url || '',
      liveUrl: proj.liveUrl || proj.live_url || '',
      metrics: Array.isArray(proj.metrics) ? proj.metrics.join(', ') : proj.metrics || '',
      description: proj.description || '',
      client: proj.details?.client || '',
      timeline: proj.details?.timeline || '2025',
      role: proj.details?.role || 'Lead Developer',
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
        title: projectForm.title.trim(),
        category: projectForm.category,
        tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        image: projectForm.image,
        githubUrl: projectForm.githubUrl,
        liveUrl: projectForm.liveUrl,
        metrics: projectForm.metrics.split(',').map(m => m.trim()).filter(Boolean),
        description: projectForm.description,
        featured: Boolean(projectForm.featured),
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
        showToast('Project updated successfully!', 'success');
      } else {
        await api.createProject(payload);
        showToast('New project created successfully!', 'success');
      }

      setProjectModalOpen(false);
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message || 'Error saving project', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('Project deleted', 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Error deleting project', 'error');
    }
  };

  const handleToggleFeaturedProject = async (proj) => {
    try {
      await api.updateProject(proj._id || proj.id, { featured: !proj.featured });
      showToast(`Project ${!proj.featured ? 'starred as Featured' : 'unstarred'}`, 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Error updating project status', 'error');
    }
  };

  // ---------------- SKILL ACTIONS ----------------
  const openNewSkillModal = () => {
    setEditingSkill(null);
    setSkillForm({
      name: '',
      category: 'Frontend',
      level: 90,
      icon: 'code',
      featured: true,
      sort_order: skills.length + 1
    });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (s) => {
    setEditingSkill(s);
    setSkillForm({
      name: s.name || '',
      category: s.category || 'Frontend',
      level: typeof s.level === 'number' ? s.level : 90,
      icon: s.icon || 'terminal',
      featured: s.featured ?? true,
      sort_order: s.sort_order ?? 1
    });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: skillForm.name.trim(),
        category: skillForm.category,
        level: Number(skillForm.level),
        icon: skillForm.icon,
        featured: Boolean(skillForm.featured),
        sort_order: Number(skillForm.sort_order) || 0
      };

      if (editingSkill) {
        await api.updateSkill(editingSkill._id || editingSkill.id, payload);
        showToast('Skill updated successfully!', 'success');
      } else {
        await api.createSkill(payload);
        showToast('New skill added successfully!', 'success');
      }

      setSkillModalOpen(false);
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message || 'Error saving skill', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.deleteSkill(id);
      showToast('Skill deleted', 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Error deleting skill', 'error');
    }
  };

  // ---------------- BLOG ACTIONS ----------------
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      category: 'Architecture & Security',
      date: new Date().getFullYear().toString(),
      readTime: '6 min read',
      image: '',
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
      date: b.date || new Date().getFullYear().toString(),
      readTime: b.readTime || b.read_time || '6 min read',
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
        title: blogForm.title.trim(),
        category: blogForm.category,
        date: blogForm.date,
        readTime: blogForm.readTime,
        image: blogForm.image,
        summary: blogForm.summary,
        content: blogForm.content,
        published: Boolean(blogForm.published)
      };

      if (editingBlog) {
        await api.updateBlog(editingBlog._id || editingBlog.id, payload);
        showToast('Article updated successfully!', 'success');
      } else {
        await api.createBlog(payload);
        showToast('New article published successfully!', 'success');
      }

      setBlogModalOpen(false);
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message || 'Error saving article', 'error');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.deleteBlog(id);
      showToast('Article deleted', 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Error deleting article', 'error');
    }
  };

  const handleTogglePublishBlog = async (b) => {
    try {
      await api.updateBlog(b._id || b.id, { published: !b.published });
      showToast(`Article ${!b.published ? 'published' : 'moved to draft'}`, 'info');
      fetchDashboardData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Error updating article status', 'error');
    }
  };

  // ---------------- MESSAGE ACTIONS ----------------
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.deleteMessage(id);
      showToast('Message deleted', 'info');
      fetchDashboardData();
    } catch {
      showToast('Error deleting message', 'error');
    }
  };

  const handleToggleMessageRead = async (msg) => {
    try {
      const newStatus = msg.status === 'read' ? 'new' : 'read';
      await api.updateMessageStatus(msg._id || msg.id, newStatus);
      showToast(`Message marked as ${newStatus}`, 'info');
      fetchDashboardData();
    } catch {
      showToast('Error updating status', 'error');
    }
  };

  // ---------------- BOOKING ACTIONS ----------------
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await api.deleteBooking(id);
      showToast('Booking deleted', 'info');
      fetchDashboardData();
    } catch {
      showToast('Error deleting booking', 'error');
    }
  };

  const handleToggleBookingStatus = async (book) => {
    try {
      const newStatus = book.status === 'confirmed' ? 'pending' : 'confirmed';
      await api.updateBookingStatus(book._id || book.id, newStatus);
      showToast(`Booking marked as ${newStatus}`, 'info');
      fetchDashboardData();
    } catch {
      showToast('Error updating booking status', 'error');
    }
  };

  // ---------------- PASSWORD CHANGE ----------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      await api.updatePassword({ newPassword: passwordForm.newPassword });
      showToast('Password updated successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message || 'Error changing password', 'error');
    }
  };

  // ---------------- FILTERED DATA WITH SEARCH ----------------
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCat = projectCategoryFilter === 'All' || p.category === projectCategoryFilter;
      const matchesSearch = !searchQuery || 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCat && matchesSearch;
    });
  }, [projects, projectCategoryFilter, searchQuery]);

  const filteredSkills = useMemo(() => {
    return skills.filter(s => {
      const matchesCat = skillsCategoryFilter === 'All' || s.category?.toLowerCase() === skillsCategoryFilter.toLowerCase();
      const matchesSearch = !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [skills, skillsCategoryFilter, searchQuery]);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      return !searchQuery || 
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [messages, searchQuery]);

  const unreadMessagesCount = useMemo(() => {
    return messages.filter(m => m.status !== 'read').length;
  }, [messages]);

  if (!isOpen) return null;

  // Clock Formatting (Morocco / Local Studio)
  const formatDigits = (num) => String(num).padStart(2, '0');
  const rawHours = currentTime.getHours();
  const displayHours = is24Hour ? rawHours : (rawHours % 12 || 12);
  const clockString = `${formatDigits(displayHours)}:${formatDigits(currentTime.getMinutes())}:${formatDigits(currentTime.getSeconds())}`;
  
  const dateFormatted = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#F0F1F3] dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-100 min-h-screen w-full transition-colors duration-300 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 min-h-screen flex flex-col justify-between">
        {/* ================= TOP NAV HEADER ================= */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
          {/* Logo & Studio Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                Portfolio Studio
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Supabase Connected" />
              </span>
            </div>
          </div>

          {/* Search Bar matching screenshot */}
          <div className="relative w-full sm:w-72 md:w-80">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, skills, messages..."
              className="w-full bg-white/90 dark:bg-neutral-800/90 rounded-full pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 border border-neutral-300/60 dark:border-neutral-700/60 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-2xs transition-all"
            />
          </div>

          {/* Actions & Exit */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Backup JSON Button */}
            <input
              type="file"
              ref={backupFileInputRef}
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              onClick={handleExportBackup}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-neutral-300/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white flex items-center gap-1.5"
              title="Download full JSON portfolio backup"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Backup</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Settings
            </button>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                if (activeTab === 'skills') openNewSkillModal();
                else if (activeTab === 'bookings') openNewBlogModal();
                else openNewProjectModal();
              }}
              className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-4 py-2 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              + New Item
            </button>

            {/* Close Studio Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-neutral-300/80 dark:border-neutral-700 hover:border-black dark:hover:border-white flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all cursor-pointer"
              title="Close Studio (Esc)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* ================= MASSIVE HERO CLOCK / METRIC CENTER ================= */}
        <section className="pt-4 pb-2 select-none">
          <div className="flex items-center justify-center">
            {viewMetricMode ? (
              <div className="flex items-baseline gap-2 py-4">
                <span className="font-extrabold tracking-tighter text-neutral-950 dark:text-white text-6xl sm:text-8xl md:text-9xl lg:text-[130px] leading-none tabular-nums font-mono">
                  {projects.length + skills.length}
                </span>
                <span className="text-xl sm:text-3xl font-bold text-neutral-400 font-mono">
                  ASSETS
                </span>
              </div>
            ) : (
              <h1 className="font-extrabold tracking-tighter text-neutral-950 dark:text-white text-6xl sm:text-8xl md:text-9xl lg:text-[135px] leading-none py-2 tabular-nums font-mono text-center">
                {clockString}
              </h1>
            )}
          </div>

          {/* Sub-Clock Information Bar matching screenshot */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
            <div>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">Current</span>
              <span className="mx-2">•</span>
              <span>Morocco Studio Time (UTC+1)</span>
            </div>

            <div className="text-center font-mono text-[11px] sm:text-xs">
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Sun ☀️: 07:12 - 19:30 (12h 18m)</span>
              <span className="block sm:inline sm:ml-2 text-neutral-400 dark:text-neutral-500">
                {dateFormatted}
              </span>
            </div>

            {/* 12h / 24h & Metric Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMetricMode(!viewMetricMode)}
                className="text-[11px] font-mono underline hover:text-black dark:hover:text-white cursor-pointer mr-1"
              >
                {viewMetricMode ? 'Show Clock' : 'Show Metrics'}
              </button>
              <div className="bg-white/90 dark:bg-neutral-800/90 rounded-full p-0.5 border border-neutral-300/60 dark:border-neutral-700/60 flex items-center shadow-2xs text-[11px] font-mono">
                <button
                  onClick={() => setIs24Hour(false)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    !is24Hour ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold' : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  12h
                </button>
                <button
                  onClick={() => setIs24Hour(true)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    is24Hour ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold' : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  24h
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION DIVIDER & SUBTITLE ================= */}
        <div className="h-[1px] bg-neutral-300/70 dark:bg-neutral-800 my-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              {activeTab === 'projects' && 'Projects & Selected Works'}
              {activeTab === 'skills' && 'Skills & Architecture Stack'}
              {activeTab === 'messages' && 'Inbound Client Inquiries'}
              {activeTab === 'bookings' && 'Strategy Calls & Articles'}
              {activeTab === 'security' && 'Security & Studio Settings'}
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 font-normal">
              Casablanca, Morocco • Full-Stack Web Architecture
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm italic hidden lg:block">
            "Life moves fast. Stay on time, ship clean code, and enjoy every moment!"
          </p>

          <button
            onClick={() => {
              if (activeTab === 'skills') openNewSkillModal();
              else if (activeTab === 'bookings') openNewBlogModal();
              else openNewProjectModal();
            }}
            className="text-xs font-semibold text-neutral-900 dark:text-white hover:opacity-75 transition-opacity flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
          >
            <span>
              {activeTab === 'skills' && 'Add Another Skill'}
              {activeTab === 'projects' && 'Add Another Project'}
              {activeTab === 'bookings' && 'Add Another Post'}
              {activeTab === 'messages' && 'Export Leads'}
              {activeTab === 'security' && 'Save Preferences'}
            </span>
            <span className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center text-xs">
              +
            </span>
          </button>
        </div>

        {/* ================= THE FOUR ICONIC DOCK CARDS ================= */}
        {/* Exactly matching Los Angeles, New York, London, Paris in screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Card 1: Projects (Los Angeles style) */}
          <div
            onClick={() => setActiveTab('projects')}
            className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[105px] sm:min-h-[120px] ${
              activeTab === 'projects'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xl ring-2 ring-black/10 dark:ring-white/20 scale-[1.02]'
                : 'bg-white/80 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-white dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex justify-between items-start text-xs font-medium">
              <span className="font-bold">Projects</span>
              <span className="text-[11px] opacity-70">Portfolio</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {formatDigits(projects.length)}
              </span>
              <span className="text-[11px] font-medium flex items-center gap-1 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Published</span>
              </span>
            </div>
          </div>

          {/* Card 2: Skills (New York style) */}
          <div
            onClick={() => setActiveTab('skills')}
            className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[105px] sm:min-h-[120px] ${
              activeTab === 'skills'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xl ring-2 ring-black/10 dark:ring-white/20 scale-[1.02]'
                : 'bg-white/80 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-white dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex justify-between items-start text-xs font-medium">
              <span className="font-bold">Skills</span>
              <span className="text-[11px] opacity-70">Technical</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {formatDigits(skills.length)}
              </span>
              <span className="text-[11px] font-medium flex items-center gap-1 opacity-80">
                <span>5 Categories</span>
              </span>
            </div>
          </div>

          {/* Card 3: Inbound Messages (London style - iconic dark card) */}
          <div
            onClick={() => setActiveTab('messages')}
            className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[105px] sm:min-h-[120px] ${
              activeTab === 'messages'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xl ring-2 ring-black/10 dark:ring-white/20 scale-[1.02]'
                : 'bg-white/80 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-white dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex justify-between items-start text-xs font-medium">
              <span className="font-bold">Messages</span>
              <span className="text-[11px] opacity-70">Leads</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {formatDigits(messages.length)}
              </span>
              <span className="text-[11px] font-medium flex items-center gap-1">
                {unreadMessagesCount > 0 ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-amber-300 dark:text-amber-600 font-bold">{unreadMessagesCount} New</span>
                  </>
                ) : (
                  <span className="opacity-80">All Read</span>
                )}
              </span>
            </div>
          </div>

          {/* Card 4: Bookings & Blog (Paris style) */}
          <div
            onClick={() => setActiveTab('bookings')}
            className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[105px] sm:min-h-[120px] ${
              activeTab === 'bookings'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xl ring-2 ring-black/10 dark:ring-white/20 scale-[1.02]'
                : 'bg-white/80 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-white dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex justify-between items-start text-xs font-medium">
              <span className="font-bold">Schedule & Blog</span>
              <span className="text-[11px] opacity-70">Calendar</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {formatDigits(bookings.length + blogs.length)}
              </span>
              <span className="text-[11px] font-medium flex items-center gap-1 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* ================= DETAILED MANAGEMENT WORKSPACE ================= */}
        <main className="bg-white dark:bg-[#18181b] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-neutral-200/70 dark:border-neutral-800 shadow-sm min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-neutral-500 font-mono">Synchronizing portfolio assets...</p>
            </div>
          ) : (
            <>
              {/* ------------ TAB 1: PROJECTS ------------ */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Java Spring Boot', 'React', 'PHP & Laravel', 'Docker'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProjectCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            projectCategoryFilter === cat
                              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={openNewProjectModal}
                      className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-4 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-xs cursor-pointer"
                    >
                      + Create Project
                    </button>
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.map((p, pIdx) => {
                      const id = p._id || p.id || `proj-${pIdx}`;
                      return (
                        <div
                          key={id}
                          className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex gap-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 group"
                        >
                          {/* Thumbnail */}
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700/60 relative">
                            {p.image ? (
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-neutral-400 text-xl">
                                {p.title?.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Info & Actions */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 truncate">
                                  {p.category}
                                </span>
                                <button
                                  onClick={() => handleToggleFeaturedProject(p)}
                                  className={`text-xs cursor-pointer ${p.featured ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-600'}`}
                                  title="Toggle Featured"
                                >
                                  ★ {p.featured ? 'Featured' : 'Star'}
                                </button>
                              </div>

                              <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate mt-0.5">
                                {p.title}
                              </h4>

                              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                                {p.description || p.details?.client || 'Full-Stack Web App'}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 dark:border-neutral-800 mt-2">
                              <div className="flex gap-2">
                                {p.liveUrl && (
                                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-[11px] underline text-neutral-500 hover:text-black dark:hover:text-white">
                                    Live ↗
                                  </a>
                                )}
                                {p.githubUrl && (
                                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-[11px] underline text-neutral-500 hover:text-black dark:hover:text-white">
                                    Code ↗
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditProjectModal(p)}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(id)}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredProjects.length === 0 && (
                      <div className="col-span-full py-12 text-center text-xs text-neutral-400 font-mono">
                        No projects found matching the criteria. Click "+ Create Project" to add one!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------ TAB 2: SKILLS ------------ */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Tools'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSkillsCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            skillsCategoryFilter === cat
                              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={openNewSkillModal}
                      className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-4 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-xs cursor-pointer"
                    >
                      + Add New Skill
                    </button>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredSkills.map((s, sIdx) => {
                      const id = s._id || s.id || `skill-${sIdx}`;
                      return (
                        <div
                          key={id}
                          className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-400 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-neutral-400">{s.category}</span>
                              <h4 className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">{s.name}</h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white bg-neutral-200/60 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                              {s.level || 90}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full my-3 overflow-hidden">
                            <div className="h-full bg-neutral-900 dark:bg-white rounded-full" style={{ width: `${s.level || 90}%` }} />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => openEditSkillModal(s)}
                              className="text-xs px-2.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(id)}
                              className="text-xs px-2.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredSkills.length === 0 && (
                      <div className="col-span-full py-12 text-center text-xs text-neutral-400 font-mono">
                        No skills found. Click "+ Add New Skill" to register technologies.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------ TAB 3: INBOUND MESSAGES ------------ */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs font-mono text-neutral-500">
                      Total Leads: {messages.length} ({unreadMessagesCount} unread)
                    </span>
                    <button
                      onClick={fetchDashboardData}
                      className="text-xs underline text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      Refresh Leads
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredMessages.map((m, mIdx) => {
                      const id = m._id || m.id || `msg-${mIdx}`;
                      const isUnread = m.status !== 'read';
                      return (
                        <div
                          key={id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isUnread
                              ? 'bg-amber-50/40 dark:bg-amber-950/15 border-amber-300 dark:border-amber-700/60'
                              : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {isUnread && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{m.name}</h4>
                              <span className="text-xs text-neutral-400 font-mono">({m.email})</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="bg-neutral-200/80 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full font-mono text-[11px]">
                                {m.project_type || m.projectType || 'Full-Stack'}
                              </span>
                              <span className="text-neutral-400 text-[11px] font-mono">
                                {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white/70 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/40 my-2 whitespace-pre-wrap">
                            {m.message}
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <a
                              href={`mailto:${m.email}?subject=RE: Project Inquiry - Hamza Zaidi`}
                              className="text-xs font-semibold px-3 py-1 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
                            >
                              Reply via Email ↗
                            </a>
                            <button
                              onClick={() => handleToggleMessageRead(m)}
                              className="text-xs font-semibold px-3 py-1 rounded-md bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 cursor-pointer"
                            >
                              {isUnread ? 'Mark as Read' : 'Mark as Unread'}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(id)}
                              className="text-xs font-semibold px-3 py-1 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredMessages.length === 0 && (
                      <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                        No contact inquiries found. New submissions from your portfolio will appear here!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------ TAB 4: SCHEDULE & BLOG ------------ */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  {/* Sub-navigation */}
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSubScheduleTab('bookings')}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          subScheduleTab === 'bookings'
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                            : 'text-neutral-500 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        Strategy Call Bookings ({bookings.length})
                      </button>
                      <button
                        onClick={() => setSubScheduleTab('blogs')}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          subScheduleTab === 'blogs'
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                            : 'text-neutral-500 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        Blog & Writings ({blogs.length})
                      </button>
                    </div>

                    {subScheduleTab === 'blogs' && (
                      <button
                        onClick={openNewBlogModal}
                        className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-3.5 py-1 rounded-full text-xs font-bold hover:scale-105 transition-all cursor-pointer"
                      >
                        + Write Article
                      </button>
                    )}
                  </div>

                  {/* Bookings View */}
                  {subScheduleTab === 'bookings' && (
                    <div className="space-y-3">
                      {bookings.map((b, bIdx) => {
                        const id = b._id || b.id || `booking-${bIdx}`;
                        return (
                          <div
                            key={id}
                            className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{b.name}</h4>
                                <span className="text-xs text-neutral-400 font-mono">({b.email})</span>
                              </div>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-1">
                                📅 {b.date || 'TBD'} at {b.slot || 'Flexible'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleBookingStatus(b)}
                                className={`text-xs px-3 py-1 rounded-md font-semibold cursor-pointer ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}
                              >
                                {b.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                              </button>
                              <a
                                href={`mailto:${b.email}?subject=15-Min Strategy Call Confirmation`}
                                className="text-xs px-2.5 py-1 rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 font-semibold"
                              >
                                Email
                              </a>
                              <button
                                onClick={() => handleDeleteBooking(id)}
                                className="text-xs px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 cursor-pointer font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {bookings.length === 0 && (
                        <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                          No strategic calls booked yet. Clients booking through the schedule modal will appear here.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Blog Articles View */}
                  {subScheduleTab === 'blogs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {blogs.map((b, bIdx) => {
                        const id = b._id || b.id || `blog-${bIdx}`;
                        return (
                          <div
                            key={id}
                            className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                                <span>{b.category}</span>
                                <span>{b.date || '2025'}</span>
                              </div>
                              <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{b.title}</h4>
                              <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{b.summary}</p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60 dark:border-neutral-800 mt-3">
                              <button
                                onClick={() => handleTogglePublishBlog(b)}
                                className={`text-[11px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                                  b.published ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-neutral-200 text-neutral-600'
                                }`}
                              >
                                {b.published ? '● Published' : '○ Draft'}
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditBlogModal(b)}
                                  className="text-xs px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(id)}
                                  className="text-xs px-2.5 py-1 rounded bg-red-100 dark:bg-red-950/60 text-red-600 hover:bg-red-200 font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {blogs.length === 0 && (
                        <div className="col-span-full py-12 text-center text-xs text-neutral-400 font-mono">
                          No blog posts created yet. Click "+ Write Article" to author your first piece.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ------------ TAB 5: SECURITY & ACCOUNT ------------ */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-xl">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">Studio Admin Account</h3>
                    <p className="text-xs text-neutral-500">
                      Logged in as: <strong className="text-neutral-900 dark:text-white">{user?.email || 'admin@hamza-portfolio.dev'}</strong>
                    </p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">New Master Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300/80 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300/80 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-sm cursor-pointer"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={onLogout}
                        className="border border-red-300 dark:border-red-900/60 text-red-600 px-5 py-2 rounded-full text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      >
                        Sign Out of Studio
                      </button>
                    </div>
                  </form>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Portfolio Data & Offline Backups</h4>
                      <p className="text-xs text-neutral-500">
                        Export all projects, skills, blogs, messages, and bookings as an offline JSON snapshot, or restore from a backup file.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleExportBackup}
                        className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download Full JSON Backup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => backupFileInputRef.current?.click()}
                        className="border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Restore from JSON File</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT PROJECT ================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] shadow-2xl relative space-y-5">
            <button
              onClick={() => setProjectModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white transition-all cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">[ Studio Projects ]</span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Able Physics"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Java Spring Boot">Java Spring Boot</option>
                    <option value="React">React</option>
                    <option value="PHP & Laravel">PHP & Laravel</option>
                    <option value="Docker">Docker</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Box */}
              <div className="space-y-2 p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <label className="text-[10px] font-mono uppercase text-neutral-600 dark:text-neutral-400 font-bold block">
                  Project Cover Image (JPG, PNG, WEBP)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {projectForm.image && (
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300 dark:border-neutral-700 shrink-0">
                      <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      ref={projectFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'project')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => projectFileInputRef.current?.click()}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      {uploading ? 'Uploading...' : '📁 Choose Image from Computer'}
                    </button>
                    <input
                      type="text"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="Or paste an image URL: /hero.png or https://..."
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2 text-[11px] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    placeholder="React, Spring Boot, Docker, JWT"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Key Metrics / Highlights</label>
                  <input
                    type="text"
                    value={projectForm.metrics}
                    onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                    placeholder="Docker CI/CD, Auth JWT, REST API"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://my-project.com"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Project Overview *</label>
                <textarea
                  rows={2}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Summary displayed on portfolio cards..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Challenge / Context (Modal)</label>
                  <textarea
                    rows={2}
                    value={projectForm.challenge}
                    onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })}
                    placeholder="Technical complexity or goals..."
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Solution Implemented (Modal)</label>
                  <textarea
                    rows={2}
                    value={projectForm.solution}
                    onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                    placeholder="Architecture choices, security, performance..."
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2 rounded-full text-xs font-bold hover:scale-105 cursor-pointer shadow-sm"
                  >
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SKILL ================= */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 w-full max-w-lg p-6 sm:p-8 rounded-[32px] shadow-2xl relative space-y-5">
            <button
              onClick={() => setSkillModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white transition-all cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">[ Studio Skills ]</span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Skill / Technology Name *</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React.js, Java Spring Boot"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Category *</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Tools">Tools & Workflow</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Mastery Level ({skillForm.level}%)</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                    className="w-full mt-3 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2 rounded-full text-xs font-bold hover:scale-105 cursor-pointer shadow-sm"
                >
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT BLOG ================= */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] shadow-2xl relative space-y-5">
            <button
              onClick={() => setBlogModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white transition-all cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">[ Studio Blog ]</span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {editingBlog ? 'Edit Article' : 'Write New Article'}
              </h3>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Designing Enterprise REST APIs with Spring Boot"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Category</label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Year / Date</label>
                  <input
                    type="text"
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Article Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Short brief displayed on cards..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">Full Markdown Content *</label>
                <textarea
                  rows={5}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Full technical article content..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                  />
                  <span>Publish Immediately</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBlogModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2 rounded-full text-xs font-bold hover:scale-105 cursor-pointer shadow-sm"
                  >
                    {editingBlog ? 'Save Changes' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
