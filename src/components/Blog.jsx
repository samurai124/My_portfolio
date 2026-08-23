import React from 'react';

function Blog({ blogs, setSelectedBlog, copy }) {
  return (
    <section className="px-4 md:px-margin-edge py-12 md:py-20" id="blog">
      <div className="text-center mb-12">
        <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">{copy.blog.kicker}</span>
        <h2 className="font-headline-lg text-2xl md:text-4xl mb-3 text-primary font-bold">{copy.blog.title}</h2>
        <p className="text-on-surface-variant text-xs sm:text-sm max-w-xl mx-auto">
          {copy.blog.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start text-xs sm:text-sm">
        {blogs.map((blog, idx) => (
          <article 
            key={blog.id} 
            onClick={() => setSelectedBlog(blog)}
            className={`group cursor-pointer ${idx === 1 ? "md:mt-12" : idx === 2 ? "md:mt-6" : ""}`}
          >
            <div className="aspect-[16/10] bg-surface-container overflow-hidden mb-4 border border-outline-variant/10">
              <img 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                alt={blog.title} 
                src={blog.image}
              />
            </div>
            <div className="flex gap-2 items-center text-[10px] font-label-sm text-on-surface-variant mb-2">
              <span className="bg-surface-container-highest px-2 py-0.5 text-[9px] uppercase tracking-wider">{blog.category}</span>
              <span>—</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>
            <h3 className="font-headline-lg text-base md:text-lg mb-2 text-on-surface group-hover:text-primary group-hover:underline decoration-primary font-bold">
              {blog.title}
            </h3>
            <p className="text-on-surface-variant leading-relaxed line-clamp-2 text-xs sm:text-sm">
              {blog.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Blog;
