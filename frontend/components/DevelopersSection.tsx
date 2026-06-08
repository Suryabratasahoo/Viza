'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Developer {
  name: string;
  role: string;
  image: string;
}

const developers: Developer[] = [
  {
    name: "Students",
    role: "Study Smarter",
    image: "/assets/image/student.jpeg",
  },
  {
    name: "Researchers",
    role: "Discover Insights",
    image: "/assets/image/researcher.jpeg",
  },
  {
    name: "Professionals",
    role: "Work Efficiently",
    image: "/assets/image/professional.jpeg",
  },
];

export default function DevelopersSection() {
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

  return (
    <section className="relative w-full bg-white py-20 px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto select-none overflow-hidden border-b border-grey-50/50">
      
      {/* Testimonial Header split */}
      <div 
        ref={headerRef}
        style={{
          transform: headerVisible ? 'translateY(0)' : 'translateY(35px)',
          opacity: headerVisible ? 1 : 0,
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
        }}
        className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 text-left"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-[#121317] md:w-[48%] leading-[1.1]">
          Built for everyone who works with information
        </h2>
        <p className="text-sm md:text-base text-grey-800 leading-relaxed font-sans md:w-[45%] md:mt-2">
          Whether you are a student studying for exams, a researcher analyzing data, or a professional managing documents, our platform helps you unlock the full value of your knowledge through AI-powered conversations.
        </p>
      </div>

      {/* Testimonial horizontal track */}
      <div className="relative w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 w-max min-w-full">
          {developers.map((dev, index) => (
            <div 
              key={index}
              className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[340px] md:h-[400px] rounded-3xl overflow-hidden bg-grey-15 group shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] flex-shrink-0"
            >
              {/* Developer headshot image */}
              <Image
                src={dev.image}
                alt={`${dev.name} - ${dev.role}`}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 280px, 360px"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:from-black/70" />

              {/* Bottom Label overlay */}
              <div className="absolute bottom-6 left-6 text-white z-10 flex flex-col gap-0.5">
                <span className="text-xl md:text-2xl font-medium tracking-tight font-sans">
                  {dev.role}
                </span>
                <span className="text-xs text-white/70 font-sans tracking-wide">
                  {dev.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
