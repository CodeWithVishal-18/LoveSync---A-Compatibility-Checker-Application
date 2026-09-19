// Lightweight, zero-dependency canvas confetti and hearts shower

export function fireConfetti(options = {}) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const resizeHandler = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeHandler);

  const colors = [
    '#ff2d55', '#ff375f', '#ff7597', '#ff6b8b', '#ffb199', 
    '#ffd166', '#a29bfe', '#fd79a8', '#ff9ff3', '#ffeaa7'
  ];

  const particleCount = options.count || 90;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * (width * 0.4),
      y: height * 0.35 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() * -12) - 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'circle' : 'rect'),
      opacity: 1,
      gravity: 0.28,
      drag: 0.985
    });
  }

  function drawHeart(x, y, size, color, rot, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    const d = size / 2;
    ctx.moveTo(0, d / 2);
    ctx.bezierCurveTo(-d, -d / 2, -d, -d * 1.3, 0, -d * 0.8);
    ctx.bezierCurveTo(d, -d * 1.3, d, -d / 2, 0, d / 2);
    ctx.fill();
    ctx.restore();
  }

  let animationFrameId;
  const startTime = Date.now();
  const duration = options.duration || 3500;

  function render() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;

    for (let p of particles) {
      p.vx *= p.drag;
      p.vy = (p.vy + p.gravity) * p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      if (elapsed > duration * 0.5) {
        p.opacity = Math.max(0, 1 - (elapsed - duration * 0.5) / (duration * 0.5));
      }

      if (p.opacity > 0 && p.y < height + 40) {
        activeCount++;
        if (p.shape === 'heart') {
          drawHeart(p.x, p.y, p.size * 1.3, p.color, p.rotation, p.opacity);
        } else if (p.shape === 'circle') {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
          ctx.restore();
        }
      }
    }

    if (elapsed < duration && activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cleanup();
    }
  }

  function cleanup() {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeHandler);
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
