import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'star' | 'rect';
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
}

export const CelebrationFirecrackers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#0074D9',
      '#B10DC9', '#F012BE', '#01FF70', '#E76F51', '#2A9D8F',
      '#E9C46A', '#F4A261', '#FFD700', '#FF69B4', '#00FFFF'
    ];

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const createExplosion = (x: number, y: number, color?: string) => {
      const count = 50 + Math.floor(Math.random() * 30);
      const baseColor = color || colors[Math.floor(Math.random() * colors.length)];
      
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 6;
        const pColor = Math.random() > 0.3 ? baseColor : colors[Math.floor(Math.random() * colors.length)];
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: pColor,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.015,
          size: 2.5 + Math.random() * 3,
          gravity: 0.08,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          shape: Math.random() > 0.5 ? 'rect' : (Math.random() > 0.5 ? 'star' : 'circle')
        });
      }
    };

    const launchRocket = () => {
      const x = width * 0.15 + Math.random() * width * 0.7;
      const targetY = height * 0.15 + Math.random() * (height * 0.35);
      const color = colors[Math.floor(Math.random() * colors.length)];
      rockets.push({
        x,
        y: height,
        targetY,
        vx: (Math.random() - 0.5) * 2,
        vy: -(8 + Math.random() * 5),
        color,
        trail: []
      });
    };

    // Initial festive burst from multiple locations
    setTimeout(() => {
      createExplosion(width * 0.25, height * 0.3);
      createExplosion(width * 0.75, height * 0.3);
    }, 100);

    setTimeout(() => {
      createExplosion(width * 0.5, height * 0.25);
    }, 350);

    // Continuous rocket launches
    const rocketInterval = setInterval(() => {
      launchRocket();
    }, 400);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 5) r.trail.shift();

        // Draw rocket spark trail
        ctx.beginPath();
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 2.5 * (t / r.trail.length);
          if (t === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Rocket tip sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Explode when reaching peak
        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size, -p.size * 1.6, p.size * 2, p.size * 3.2);
        } else if (p.shape === 'star') {
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size * 1.5,
              -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size * 1.5
            );
            ctx.lineTo(
              Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.7),
              -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.7)
            );
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(rocketInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
    />
  );
};

