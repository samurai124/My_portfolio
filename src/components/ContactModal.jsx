import React from 'react';

function ContactModal({
  contactOpen,
  setContactOpen,
  activeTab,
  setActiveTab,
  messageForm,
  setMessageForm,
  messageFormErrors,
  messageFormSuccess,
  handleMessageSubmit,
  bookingForm,
  setBookingForm,
  bookingFormErrors,
  bookingFormSuccess,
  handleBookingSubmit,
  upcomingDates,
  timeSlots,
  copy
}) {
  if (!contactOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
      <div className="bg-surface border border-outline-variant w-full max-w-lg overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-outline-variant/40 p-5">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-primary">{copy.contact.heading}</h3>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{copy.contact.subheading}</p>
          </div>
          <button 
            onClick={() => setContactOpen(false)}
            className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            aria-label="Close form"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Tabs selector */}
        <div className="flex border-b border-outline-variant/30">
          <button 
            onClick={() => setActiveTab("message")}
            className={`flex-1 py-3 font-label-sm text-[11px] uppercase tracking-wider border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === "message" 
                ? "border-primary text-primary" 
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {copy.contact.messageTab}
          </button>
          <button 
            onClick={() => setActiveTab("call")}
            className={`flex-1 py-3 font-label-sm text-[11px] uppercase tracking-wider border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === "call" 
                ? "border-primary text-primary" 
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {copy.contact.callTab}
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === "message" ? (
            messageFormSuccess ? (
              <div className="py-10 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center mx-auto rounded-none">
                  <span className="material-symbols-outlined text-3xl text-primary">done</span>
                </div>
                <h4 className="text-base font-bold text-primary">{copy.contact.successTitle}</h4>
                <p className="text-on-surface-variant text-xs max-w-xs mx-auto">
                  {copy.contact.successText}
                </p>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">{copy.contact.nameLabel}</label>
                  <input 
                    type="text" 
                    value={messageForm.name}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary p-2.5 rounded-none focus:outline-none text-xs text-primary transition-all"
                    placeholder={copy.contact.namePlaceholder}
                  />
                  {messageFormErrors.name && <p className="text-[10px] text-error mt-0.5">{messageFormErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">{copy.contact.emailLabel}</label>
                  <input 
                    type="email" 
                    value={messageForm.email}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary p-2.5 rounded-none focus:outline-none text-xs text-primary transition-all"
                    placeholder={copy.contact.emailPlaceholder}
                  />
                  {messageFormErrors.email && <p className="text-[10px] text-error mt-0.5">{messageFormErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">{copy.contact.projectType}</label>
                  <select 
                    value={messageForm.projectType}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary p-2.5 rounded-none focus:outline-none text-xs text-primary transition-all"
                  >
                    <option>Full-Stack Web App</option>
                    <option>React Frontend</option>
                    <option>REST API Backend</option>
                    <option>Authentication &amp; Roles</option>
                    <option>Docker / Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">{copy.contact.briefLabel}</label>
                  <textarea 
                    rows="3"
                    value={messageForm.message}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary p-2.5 rounded-none focus:outline-none text-xs text-primary transition-all"
                    placeholder={copy.contact.briefPlaceholder}
                  ></textarea>
                  {messageFormErrors.message && <p className="text-[10px] text-error mt-0.5">{messageFormErrors.message}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-on-primary py-2.5 font-label-sm text-[11px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  {copy.contact.send}
                </button>
                {messageFormErrors.submit && (
                  <p className="text-[10px] text-error mt-1">{messageFormErrors.submit}</p>
                )}
              </form>
            )
          ) : (
            bookingFormSuccess ? (
              <div className="py-10 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center mx-auto rounded-none">
                  <span className="material-symbols-outlined text-3xl text-primary">done</span>
                </div>
                <h4 className="text-base font-bold text-primary">Strategy Call Booked!</h4>
                <p className="text-on-surface-variant text-xs max-w-xs mx-auto">
                  Your alignment session is scheduled for <span className="font-semibold text-primary">{bookingForm.date}</span> at <span className="font-semibold text-primary">{bookingForm.slot}</span>. Check your inbox for the calendar invite and meet link.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Name *</label>
                    <input 
                      type="text" 
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary p-2.5 rounded-none focus:outline-none text-xs text-primary transition-all"
                      placeholder="Name"
                    />
                    {bookingFormErrors.name && <p className="text-[10px] text-error mt-0.5">{bookingFormErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Email *</label>
                    <input 
                      type="email" 
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary p-2.5 rounded-none focus:outline-none text-xs text-primary transition-all"
                      placeholder="Email"
                    />
                    {bookingFormErrors.email && <p className="text-[10px] text-error mt-0.5">{bookingFormErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">Select Date *</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {upcomingDates.map((date) => {
                      const valString = date.toISOString().split('T')[0];
                      return (
                        <button
                          type="button"
                          key={valString}
                          onClick={() => setBookingForm(prev => ({ ...prev, date: valString }))}
                          className={`p-2 text-center border transition-all rounded-none font-label-sm cursor-pointer ${
                            bookingForm.date === valString
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant/50 hover:border-primary text-on-surface-variant hover:text-primary bg-surface-container/50"
                          }`}
                        >
                          <span className="block text-[9px] uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="block text-xs font-bold mt-0.5">{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                  {bookingFormErrors.date && <p className="text-[10px] text-error mt-0.5">{bookingFormErrors.date}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">Select Time Slot *</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setBookingForm(prev => ({ ...prev, slot }))}
                        className={`p-2.5 text-center border transition-all rounded-none font-label-sm text-[11px] cursor-pointer ${
                          bookingForm.slot === slot
                            ? "bg-primary text-on-primary border-primary"
                            : "border-outline-variant/50 hover:border-primary text-on-surface-variant hover:text-primary bg-surface-container/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {bookingFormErrors.slot && <p className="text-[10px] text-error mt-0.5">{bookingFormErrors.slot}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-on-primary py-2.5 font-label-sm text-[11px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  {copy.contact.book}
                </button>
                {bookingFormErrors.submit && (
                  <p className="text-[10px] text-error mt-1">{bookingFormErrors.submit}</p>
                )}
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
