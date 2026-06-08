'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Blog {
  image: string;
  title: string;
  description: string;
}

const blogs: Blog[] = [
  {
    image: "/assets/image/upload.jpeg",
    title: "Upload Documents",
    description: "Import PDFs, reports, notes, and research papers."
  },
  {
    image: "/assets/image/chat.jpeg",
    title: "Chat with AI",
    description: "Ask questions and get answers grounded in your files."
  },
  {
    image: "/assets/image/insights.jpeg",
    title: "Generate Insights",
    description: "Extract summaries, key points, and actionable knowledge."
  },
  {
    image: "/assets/image/search.jpeg",
    title: "Semantic Search",
    description: "Find information instantly across thousands of pages."
  },

];

export default function LatestBlogs() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    const currentRef = headerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const cardWidth = 300; // approximation of card + gap
      const offset = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollTo({
        left: scrollLeft + offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full bg-white py-20 px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto select-none overflow-hidden border-b border-grey-50/50">

      {/* Blog Section Header */}
      <div
        ref={headerRef}
        style={{
          transform: headerVisible ? 'translateY(0)' : 'translateY(35px)',
          opacity: headerVisible ? 1 : 0,
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
        }}
        className="flex items-end justify-between mb-10 text-left"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-[#121317]">
          Core Features
        </h2>
        <span className="text-sm font-medium text-grey-800 hover:text-grey-1200 cursor-pointer underline underline-offset-4 decoration-grey-200 hover:decoration-grey-1200 transition-colors">
          Try Out
        </span>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="w-[260px] sm:w-[280px] md:w-[310px] flex-shrink-0 snap-start flex flex-col gap-4 group cursor-pointer"
          >
            {/* Card Image */}
            <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-black shadow-sm">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 260px, 310px"
              />
            </div>

            {/* Card Metadata */}
            <div className="flex flex-col gap-2 px-1">
              <h3 className="text-base sm:text-lg font-medium text-grey-1200 leading-snug group-hover:text-[#4285F4] transition-colors line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-sm text-grey-800 leading-relaxed line-clamp-3">
                {blog.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows at bottom */}
      <div className="flex items-center gap-3.5 mt-8">
        <button
          onClick={() => scroll('left')}
          className="w-11 h-11 rounded-full border border-grey-200 flex items-center justify-center text-grey-800 hover:text-grey-1200 hover:border-grey-400 active:bg-grey-15 transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-11 h-11 rounded-full border border-grey-200 flex items-center justify-center text-grey-800 hover:text-grey-1200 hover:border-grey-400 active:bg-grey-15 transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7-7" />
          </svg>
        </button>
      </div>

    </section>
  );
}
