"use client";
import { useEffect } from 'react';

export default function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = Array.from(document.querySelectorAll('section'));

    sections.forEach((el) => el.classList.add('reveal'));

    if (prefersReduced) {
      sections.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Compute a map of parent -> children sections to get sibling order
    const parentMap = new Map();
    sections.forEach((s) => {
      const parent = s.parentElement || document;
      const list = parentMap.get(parent) || [];
      list.push(s);
      parentMap.set(parent, list);
    });

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // compute nesting depth (# of ancestor <section> elements)
          let depth = 0;
          let p = el.parentElement;
          while (p) {
            if (p.tagName && p.tagName.toLowerCase() === 'section') depth += 1;
            p = p.parentElement;
          }

          // compute sibling index within same parent
          const siblings = parentMap.get(el.parentElement) || [];
          const siblingIndex = Math.max(0, siblings.indexOf(el));

          // delay = depth * parentGap + siblingIndex * itemGap, capped
          const itemGap = 60; // ms between siblings
          const parentGap = 160; // ms delay per nesting level so children follow parent
          const rawDelay = depth * parentGap + siblingIndex * itemGap;
          const delay = Math.min(900, Math.max(0, rawDelay));

          // make hero and features more prominent by increasing duration and start offset via CSS vars
          if (el.classList.contains('hero')) {
            el.style.setProperty('--reveal-duration', '1100ms');
            el.style.setProperty('--reveal-start-y', '32px');
          } else if (el.classList.contains('features') || el.classList.contains('useCases') || el.classList.contains('videoCards')) {
            el.style.setProperty('--reveal-duration', '1000ms');
            el.style.setProperty('--reveal-start-y', '20px');
          }

          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.14 });

    sections.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
