"use client";
import { useEffect, useRef, useState } from 'react';
import styles from '../app/page.module.css';

export default function FeatureVideo({ src, poster, className, muted = true, loop = true, autoPlay = true }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (isVisible && !v.src) {
      v.src = src;
      if (autoPlay) {
        const p = v.play();
        if (p && p.then) p.catch(() => {});
      }
    }
  }, [isVisible, src, autoPlay]);

  function handleTogglePlay() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className={`${styles.featureVideo} ${className || ''}`}>
      <div style={{width:'100%'}}>
        <video
          ref={ref}
          poster={poster}
          playsInline
          muted={muted}
          loop={loop}
          preload="none"
          controls={false}
          aria-hidden="true"
          style={{width:'300px', borderRadius:8, display:'block'}}
        />
        <button
          aria-label="Toggle video"
          onClick={handleTogglePlay}
          style={{
            position:'absolute',
            right:18,
            bottom:18,
            background:'rgba(0,0,0,0.6)',
            color:'#fff',
            border:0,
            padding:'8px 10px',
            borderRadius:8,
            cursor:'pointer'
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}
