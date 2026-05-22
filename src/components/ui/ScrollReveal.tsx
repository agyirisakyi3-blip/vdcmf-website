"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "fade-up" | "fade-left" | "fade-right";
  className?: string;
  as?: React.ElementType;
}

// Wrapper that animates children into view via IntersectionObserver
export default function ScrollReveal({
  children,
  direction = "fade-up",
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Observe element once; add "visible" class when it enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      data-reveal={direction}
      className={className}
    >
      {children}
    </Component>
  );
}
