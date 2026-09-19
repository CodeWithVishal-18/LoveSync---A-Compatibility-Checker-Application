import React, { useMemo } from 'react';

export default function FloatingHearts() {
  const hearts = useMemo(() => {
    const symbols = ['💖', '💕', '💗', '💓', '💘'];
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 5.5 + Math.random() * 5).toFixed(1)}%`,
      size: `${(14 + Math.random() * 16).toFixed(0)}px`,
      duration: `${(7 + Math.random() * 7).toFixed(1)}s`,
      delay: `${(Math.random() * 6).toFixed(1)}s`,
      opacity: (0.2 + Math.random() * 0.4).toFixed(2),
    }));
  }, []);

  return (
    <div className="floating-hearts-container" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: h.opacity,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}
