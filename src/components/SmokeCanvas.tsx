import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SmokePreset } from '../types';
import { sound } from '../utils/audio';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  vRot: number;
  color: string;
  isPixel: boolean;
  active: boolean;
}

interface SmokeCanvasProps {
  isActive: boolean;
  preset: SmokePreset;
  onRevealReady: () => void;
  isComplete: boolean;
  onClearedPercentChange?: (pct: number) => void;
}

export const SmokeCanvas: React.FC<SmokeCanvasProps> = ({
  isActive,
  preset,
  onRevealReady,
  isComplete,
  onClearedPercentChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const [clearedPercent, setClearedPercent] = useState(0);
  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isPointerDown = useRef(false);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const count = preset.particleMode === 'pixel' ? 140 : 180;
    const particles: SmokeParticle[] = [];

    const centerX = width / 2;
    const centerY = height * 0.65;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (width * 0.35);
      const color = preset.colors[Math.floor(Math.random() * preset.colors.length)];

      particles.push({
        x: centerX + Math.cos(angle) * dist * 0.4,
        y: centerY + Math.sin(angle) * dist * 0.3,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -Math.random() * 2.2 - 0.4, // float upwards
        radius: preset.particleMode === 'pixel' ? Math.random() * 16 + 12 : Math.random() * 55 + 40,
        maxRadius: preset.particleMode === 'pixel' ? 32 : 120,
        alpha: Math.random() * 0.3 + 0.5,
        maxAlpha: 0.85,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        color,
        isPixel: preset.particleMode === 'pixel',
        active: true,
      });
    }

    particlesRef.current = particles;
  }, [preset]);

  // Handle Canvas Setup and Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Mask canvas for scratch / wipe reveal tracking
      if (!maskCanvasRef.current) {
        maskCanvasRef.current = document.createElement('canvas');
      }
      maskCanvasRef.current.width = 60; // low-res grid for instant coverage math
      maskCanvasRef.current.height = 60;
      const mctx = maskCanvasRef.current.getContext('2d');
      if (mctx) {
        mctx.fillStyle = '#000000';
        mctx.fillRect(0, 0, 60, 60);
      }

      initParticles(canvas.width, canvas.height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [initParticles]);

  // Main Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (isComplete) {
        // Fade out everything rapidly
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Draw active smoke particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.active) continue;

        // Physics updates
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Slight expansion and slow dissipation
        if (p.radius < p.maxRadius) {
          p.radius += 0.15;
        }

        // Boundary wrap / recycle from base if smoking
        if (p.y < -p.radius || p.x < -p.radius || p.x > w + p.radius) {
          p.x = w / 2 + (Math.random() - 0.5) * (w * 0.4);
          p.y = h * 0.7 + (Math.random() - 0.5) * 60;
          p.vy = -Math.random() * 2.2 - 0.5;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.radius = p.isPixel ? 14 : 35;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isPixel) {
          // Pixel Block Smoke
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          const half = p.radius / 2;
          ctx.fillRect(-half, -half, p.radius, p.radius);
          // Dark pixel outline
          ctx.strokeStyle = '#1a1a24';
          ctx.lineWidth = 2;
          ctx.strokeRect(-half, -half, p.radius, p.radius);
        } else {
          // Volumetric soft cloud
          const grad = ctx.createRadialGradient(0, 0, p.radius * 0.1, 0, 0, p.radius);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.6, p.color);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.globalAlpha = p.alpha * 0.45;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Floating sparkling dust for cosmic / golden modes
          if (preset.particleMode === 'cosmic' || preset.particleMode === 'golden') {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.random() * 0.8 + 0.2;
            ctx.fillRect((Math.random() - 0.5) * p.radius, (Math.random() - 0.5) * p.radius, 3, 3);
          }
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isActive, isComplete, preset]);

  // Interactive Cursor / Finger Wipe
  const handleWipe = (clientX: number, clientY: number, forceBlow = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive || isComplete) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Repel smoke particles near cursor
    const repelRadius = forceBlow ? canvas.width * 0.8 : canvas.width * 0.22;
    const particles = particlesRef.current;

    let displaced = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelRadius) {
        displaced++;
        const force = (1 - dist / repelRadius) * (forceBlow ? 25 : 12);
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
        p.alpha = Math.max(0, p.alpha - (forceBlow ? 0.4 : 0.08));
      }
    }

    // Play whoosh if moved fast
    const now = Date.now();
    if (lastMousePos.current) {
      const dt = now - lastMousePos.current.time;
      const dx = clientX - lastMousePos.current.x;
      const dy = clientY - lastMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / (dt || 1);
      if (speed > 1.2 && dt > 120) {
        sound.playWipeWhoosh();
      }
    }
    lastMousePos.current = { x: clientX, y: clientY, time: now };

    // Update mask canvas to calculate reveal percentage
    const mask = maskCanvasRef.current;
    if (mask) {
      const mctx = mask.getContext('2d');
      if (mctx) {
        const mx = (x / canvas.width) * 60;
        const my = (y / canvas.height) * 60;
        const mr = forceBlow ? 30 : 10;

        mctx.fillStyle = '#ffffff';
        mctx.beginPath();
        mctx.arc(mx, my, mr, 0, Math.PI * 2);
        mctx.fill();

        // Sample white pixels
        const imgData = mctx.getImageData(0, 0, 60, 60);
        let clearedCount = 0;
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 128) clearedCount++;
        }

        const pct = Math.min(100, Math.round((clearedCount / (60 * 60)) * 100));
        setClearedPercent(pct);
        if (onClearedPercentChange) {
          onClearedPercentChange(pct);
        }

        // Auto trigger reveal once user wiped >= 60% of the screen
        if (pct >= 58 && !isComplete) {
          onRevealReady();
        }
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handleWipe(e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDown.current = true;
    handleWipe(e.clientX, e.clientY);
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto select-none overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full h-full cursor-crosshair active:cursor-grabbing transition-opacity duration-700"
        style={{ opacity: isComplete ? 0 : 1 }}
      />

      {/* Floating Wipe Instructions & Progress Ring */}
      {isActive && !isComplete && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-2xl pointer-events-none animate-pulse">
          <span className="text-xl">💨</span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide text-white uppercase font-pixel">
              Swipe or Wipe Smoke to Reveal
            </span>
            <div className="w-36 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-emerald-400 transition-all duration-150 rounded-full"
                style={{ width: `${clearedPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold text-amber-300 font-mono">
            {clearedPercent}%
          </span>
        </div>
      )}
    </div>
  );
};
