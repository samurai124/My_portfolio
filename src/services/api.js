import { supabase } from './supabaseClient';

const ASSET_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'portfolio-assets';

const ok = (data, message = 'OK') => ({ success: true, data, message });

const normalizeError = (error, fallbackMessage) => {
  const message = error?.message || fallbackMessage;
  return new Error(message);
};

const mapProjectFromDb = (row) => ({
  ...row,
  githubUrl: row.github_url,
  liveUrl: row.live_url
});

const mapProjectToDb = (projectData) => ({
  title: projectData.title,
  category: projectData.category,
  tags: projectData.tags || [],
  image: projectData.image,
  github_url: projectData.githubUrl || null,
  live_url: projectData.liveUrl || null,
  metrics: projectData.metrics || [],
  description: projectData.description || null,
  details: projectData.details || {},
  featured: projectData.featured ?? false,
  published: projectData.published ?? true
});

const mapBlogFromDb = (row) => ({
  ...row,
  readTime: row.read_time
});

const mapBlogToDb = (blogData) => ({
  title: blogData.title,
  category: blogData.category,
  date: blogData.date,
  read_time: blogData.readTime || null,
  image: blogData.image || null,
  summary: blogData.summary || null,
  content: blogData.content || null,
  published: blogData.published ?? true
});

const mapMessageFromDb = (row) => ({
  ...row,
  projectType: row.project_type
});

const mapMessageToDb = (messageData) => ({
  name: messageData.name,
  email: messageData.email,
  project_type: messageData.projectType || null,
  message: messageData.message,
  status: messageData.status || 'new'
});

const runSelect = async (query, fallbackMessage) => {
  const { data, error } = await query;
  if (error) throw normalizeError(error, fallbackMessage);
  return data ?? [];
};

export const api = {
  // Authentication
  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw normalizeError(error, 'Erreur de connexion');
    return ok({ user: data.user, session: data.session }, 'Connexion réussie');
  },
  getMe: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw normalizeError(error, 'Impossible de récupérer l\'utilisateur');
    return ok(data.user);
  },
  updateAdminProfile: async (profileData) => {
    const { data, error } = await supabase.auth.updateUser({ data: profileData });
    if (error) throw normalizeError(error, 'Erreur de mise à jour du profil');
    return ok(data.user, 'Profil mis à jour');
  },
  updateAdminPassword: async ({ newPassword }) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw normalizeError(error, 'Erreur lors du changement de mot de passe');
    return ok(data.user, 'Mot de passe mis à jour');
  },
  updatePassword: async ({ newPassword }) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw normalizeError(error, 'Erreur lors du changement de mot de passe');
    return ok(data.user, 'Mot de passe mis à jour');
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw normalizeError(error, 'Erreur lors de la déconnexion');
    return ok(null, 'Déconnexion réussie');
  },

  // Projects CRUD
  getProjects: async (category) => {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    const data = await runSelect(query, 'Erreur lors du chargement des projets');
    const mapped = data.map(mapProjectFromDb);
    return ok(mapped);
  },
  getProjectById: async (id) => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) throw normalizeError(error, 'Projet introuvable');
    return ok(mapProjectFromDb(data));
  },
  createProject: async (projectData) => {
    const { data, error } = await supabase.from('projects').insert([mapProjectToDb(projectData)]).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la création du projet');
    return ok(mapProjectFromDb(data), 'Projet créé');
  },
  updateProject: async (id, projectData) => {
    const { data, error } = await supabase.from('projects').update(mapProjectToDb(projectData)).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour du projet');
    return ok(mapProjectFromDb(data), 'Projet mis à jour');
  },
  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression du projet');
    return ok(null, 'Projet supprimé');
  },

  // Services CRUD
  getServices: async () => {
    const data = await runSelect(
      supabase.from('services').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
      'Erreur lors du chargement des services'
    );
    return ok(data);
  },
  createService: async (serviceData) => {
    const { data, error } = await supabase.from('services').insert([serviceData]).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la création du service');
    return ok(data, 'Service créé');
  },
  updateService: async (id, serviceData) => {
    const { data, error } = await supabase.from('services').update(serviceData).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour du service');
    return ok(data, 'Service mis à jour');
  },
  deleteService: async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression du service');
    return ok(null, 'Service supprimé');
  },

  // Testimonials CRUD
  getTestimonials: async () => {
    const data = await runSelect(
      supabase.from('testimonials').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
      'Erreur lors du chargement des témoignages'
    );
    return ok(data);
  },
  createTestimonial: async (testimonialData) => {
    const { data, error } = await supabase.from('testimonials').insert([testimonialData]).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la création du témoignage');
    return ok(data, 'Témoignage créé');
  },
  updateTestimonial: async (id, testimonialData) => {
    const { data, error } = await supabase.from('testimonials').update(testimonialData).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour du témoignage');
    return ok(data, 'Témoignage mis à jour');
  },
  deleteTestimonial: async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression du témoignage');
    return ok(null, 'Témoignage supprimé');
  },

  // FAQs CRUD
  getFaqs: async () => {
    const data = await runSelect(
      supabase.from('faqs').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
      'Erreur lors du chargement des FAQ'
    );
    return ok(data);
  },
  createFaq: async (faqData) => {
    const { data, error } = await supabase.from('faqs').insert([faqData]).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la création de la FAQ');
    return ok(data, 'FAQ créée');
  },
  updateFaq: async (id, faqData) => {
    const { data, error } = await supabase.from('faqs').update(faqData).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour de la FAQ');
    return ok(data, 'FAQ mise à jour');
  },
  deleteFaq: async (id) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression de la FAQ');
    return ok(null, 'FAQ supprimée');
  },

  // Blog Articles CRUD
  getBlogs: async (category, all = false) => {
    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (!all) {
      query = query.eq('published', true);
    }
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    const data = await runSelect(query, 'Erreur lors du chargement des articles');
    return ok(data.map(mapBlogFromDb));
  },
  getBlogById: async (id) => {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
    if (error) throw normalizeError(error, 'Article introuvable');
    return ok(mapBlogFromDb(data));
  },
  createBlog: async (blogData) => {
    const { data, error } = await supabase.from('blogs').insert([mapBlogToDb(blogData)]).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la création de l\'article');
    return ok(mapBlogFromDb(data), 'Article créé');
  },
  updateBlog: async (id, blogData) => {
    const { data, error } = await supabase.from('blogs').update(mapBlogToDb(blogData)).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour de l\'article');
    return ok(mapBlogFromDb(data), 'Article mis à jour');
  },
  deleteBlog: async (id) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression de l\'article');
    return ok(null, 'Article supprimé');
  },

  // Messages (Contact Form)
  sendMessage: async (messageData) => {
    const { error } = await supabase.from('messages').insert([mapMessageToDb(messageData)]);
    if (error) throw normalizeError(error, 'Erreur lors de l\'envoi du message');
    return ok(null, 'Message envoyé');
  },
  getMessages: async () => {
    const data = await runSelect(
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      'Erreur lors du chargement des messages'
    );
    return ok(data.map(mapMessageFromDb));
  },
  updateMessageStatus: async (id, messageData) => {
    const { data, error } = await supabase.from('messages').update(messageData).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour du message');
    return ok(data, 'Message mis à jour');
  },
  deleteMessage: async (id) => {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression du message');
    return ok(null, 'Message supprimé');
  },

  // Bookings (Call scheduling)
  sendBooking: async (bookingData) => {
    const payload = { ...bookingData, status: bookingData.status || 'pending' };
    const { error } = await supabase.from('bookings').insert([payload]);
    if (error) throw normalizeError(error, 'Erreur lors de la création du rendez-vous');
    return ok(null, 'Rendez-vous créé');
  },
  getBookings: async () => {
    const data = await runSelect(
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      'Erreur lors du chargement des rendez-vous'
    );
    return ok(data);
  },
  updateBookingStatus: async (id, bookingData) => {
    const { data, error } = await supabase.from('bookings').update(bookingData).eq('id', id).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour du rendez-vous');
    return ok(data, 'Rendez-vous mis à jour');
  },
  deleteBooking: async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw normalizeError(error, 'Erreur lors de la suppression du rendez-vous');
    return ok(null, 'Rendez-vous supprimé');
  },

  // Profile
  getProfile: async () => {
    const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle();
    if (error) throw normalizeError(error, 'Erreur lors du chargement du profil');
    return ok(data);
  },
  updateProfile: async (profileData) => {
    const { data, error } = await supabase.from('profile').upsert(profileData).select().single();
    if (error) throw normalizeError(error, 'Erreur lors de la mise à jour du profil');
    return ok(data, 'Profil mis à jour');
  },

  // File / Image Upload
  uploadFile: async (file) => {
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `uploads/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(ASSET_BUCKET)
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      throw normalizeError(uploadError, 'Erreur lors de l\'upload du fichier');
    }

    const { data } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(filePath);

    return ok({ url: data.publicUrl, path: filePath, bucket: ASSET_BUCKET }, 'Fichier uploadé');
  }
};

export default api;
