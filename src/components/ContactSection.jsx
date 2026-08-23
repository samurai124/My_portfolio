function ContactSection({
  setActiveTab,
  setContactOpen,
  messageForm,
  setMessageForm,
  messageFormErrors,
  messageFormSuccess,
  handleMessageSubmit,
  copyToClipboard
}) {
  const steps = [
    {
      num: "1",
      title: "Let's Connect",
      desc: "Reach out and share your vision or project."
    },
    {
      num: "2",
      title: "We Discuss",
      desc: "Aligning on goals, scope, and stack."
    },
    {
      num: "3",
      title: "Make Plan",
      desc: "Choosing features, data models, and delivery steps."
    },
    {
      num: "4",
      title: "And Begin",
      desc: "Agile coding, tests, & CI/CD deployment."
    }
  ];

  return (
    <section className="px-4 md:px-8 py-2 md:py-4" id="contact">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
          {/* Left Side Box */}
        <div className="lg:col-span-6 bg-surface border border-outline-variant/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          
          {/* Workspace image header */}
          <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative border border-outline-variant/30 group">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
              alt="Development workspace"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold tracking-wide">
                Clean Code &amp; Practical Delivery
              </span>
            </div>
          </div>

          {/* 4 Steps Grid (1, 2, 3, 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-surface-container-low/60 border border-outline-variant/40 rounded-2xl p-3.5 space-y-1.5 hover:border-primary/40 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-primary">{step.title}</h4>
                  <span className="w-5 h-5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-mono flex items-center justify-center font-bold">
                    {step.num}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2 border-t border-outline-variant/30">
            <button
              onClick={() => {
                setActiveTab("call");
                setContactOpen(true);
              }}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">calendar_month</span>
              <span>Planifier un échange →</span>
            </button>

            <button
              onClick={() => copyToClipboard('hamzazaidi253@gmail.com', 'Email')}
              className="border border-outline-variant/60 hover:border-primary text-on-surface px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-xs">mail</span>
              <span>Copier l'Email</span>
            </button>
          </div>
        </div>

          {/* Right Side Contact Card */}
        <div className="lg:col-span-6 bg-[#28362d] text-white dark:bg-[#18231c] border border-white/10 rounded-3xl p-7 md:p-9 shadow-lg flex flex-col justify-between relative overflow-hidden">
          
          <div className="space-y-4">
            {/* Header Icon + Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-base text-white">magic_button</span>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                  Let's make something awesome together!
                </h3>
                <span className="text-[11px] text-white/60">Réponse garantie sous 24h</span>
              </div>
            </div>

            {messageFormSuccess && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl text-xs text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                <span>Votre message a été transmis avec succès !</span>
              </div>
            )}

            <form onSubmit={handleMessageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/70 block mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={messageForm.name}
                  onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                  placeholder="Votre nom complet"
                  className="w-full bg-white/10 border border-white/15 focus:border-white/40 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                />
                {messageFormErrors.name && (
                  <span className="text-[10px] text-red-300 block mt-1">{messageFormErrors.name}</span>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/70 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={messageForm.email}
                  onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                  placeholder="nom@entreprise.com"
                  className="w-full bg-white/10 border border-white/15 focus:border-white/40 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                />
                {messageFormErrors.email && (
                  <span className="text-[10px] text-red-300 block mt-1">{messageFormErrors.email}</span>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/70 block mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="Parlez-moi de votre projet, vos attentes ou de votre équipe..."
                  className="w-full bg-white/10 border border-white/15 focus:border-white/40 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                />
                {messageFormErrors.message && (
                  <span className="text-[10px] text-red-300 block mt-1">{messageFormErrors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-white text-[#18231c] hover:bg-white/90 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] shadow-md mt-2"
              >
                <span>Envoyer le Message</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-white/60 font-mono">
            <span>Direct: hamzazaidi253@gmail.com</span>
            <span>0626640792</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ContactSection;
