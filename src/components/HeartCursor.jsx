import { useRef, useEffect, useCallback } from "react";

const HeartCursor = () => {
  const canvasRef = useRef(null);
  const heartsRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });

  const addHeart = useCallback((x, y) => {
    heartsRef.current.push({
      x, y,
      size: 6 + Math.random() * 10,
      life: 1,
      speed: 0.008 + Math.random() * 0.012,
      dx: (Math.random() - 0.5) * 1.2,
      dy: -0.5 - Math.random() * 1.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
    });
    if (heartsRef.current.length > 30) heartsRef.current.shift();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      mouseRef.current = { x, y };
      if (Math.random() < 0.35) addHeart(x, y);
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) { mouseRef.current = { x: t.clientX, y: t.clientY }; }
    };

    let frameId = null;
    let lastMove = 0;
    const throttledMove = (e) => {
      const now = Date.now();
      if (now - lastMove < 40) return;
      lastMove = now;
      onMove(e);
    };

    window.addEventListener("mousemove", throttledMove);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchstart", onTouch);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hearts = heartsRef.current;

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.life -= h.speed;
        h.x += h.dx;
        h.y += h.dy;
        h.rotation += h.rotSpeed;

        if (h.life <= 0) { hearts.splice(i, 1); continue; }

        const op = h.life * 0.5;
        const s = h.size * (0.5 + 0.5 * h.life);

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.scale(s * 0.04, s * 0.04);
        ctx.globalAlpha = op;

        // Draw heart path
        ctx.beginPath();
        ctx.moveTo(0, 0.85);
        ctx.bezierCurveTo(-0.5, 0.6, -0.85, 0.3, -0.85, 0.1);
        ctx.bezierCurveTo(-0.85, -0.15, -0.6, -0.35, -0.35, -0.35);
        ctx.bezierCurveTo(-0.15, -0.35, 0, -0.2, 0, 0);
        ctx.bezierCurveTo(0, -0.2, 0.15, -0.35, 0.35, -0.35);
        ctx.bezierCurveTo(0.6, -0.35, 0.85, -0.15, 0.85, 0.1);
        ctx.bezierCurveTo(0.85, 0.3, 0.5, 0.6, 0, 0.85);
        ctx.closePath();

        ctx.fillStyle = "#e87ea0";
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [addHeart]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default HeartCursor;