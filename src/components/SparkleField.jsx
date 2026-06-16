import { useEffect, useRef } from "react";

const SparkleField = () => {
  const canvasRef = useRef(null);

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

    // Big slow stars
    const bigStars = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.8 + Math.random() * 1.6,
      speed: 0.005 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      color: ["#fff", "#fce4ec", "#f8bbd0", "#fff8e1", "#e1bee7"][
        Math.floor(Math.random() * 5)
      ],
    }));

    // Tiny fast stars
    const tinyStars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.3 + Math.random() * 0.5,
      speed: 0.01 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));

    // Drifting sparkles
    const sparkles = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.5 + Math.random() * 2.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: -0.1 - Math.random() * 0.2,
      life: Math.random(),
      speed: 0.003 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const drawStar = (x, y, r, opacity, color = "#fff") => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.6;
      ctx.fill();

      // Glow
      if (r > 1.2) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        grad.addColorStop(0, color.replace(")", ",0.15)").replace("rgb", "rgba").replace("#fce4ec", "rgba(252,228,236,0.15)").replace("#f8bbd0", "rgba(248,187,208,0.12)").replace("#fff8e1", "rgba(255,248,225,0.12)").replace("#e1bee7", "rgba(225,190,231,0.12)"));
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.globalAlpha = opacity * 0.3;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Big stars
      for (const s of bigStars) {
        const op = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        drawStar(s.x, s.y, s.r, op, s.color);
      }

      // Tiny stars
      for (const s of tinyStars) {
        const op =
          0.2 + 0.5 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        drawStar(s.x, s.y, s.r, op);
      }

      // Drifting sparkles
      for (const s of sparkles) {
        s.x += s.dx;
        s.y += s.dy;
        s.life += s.speed;
        if (s.life > 1) {
          s.x = Math.random() * canvas.width;
          s.y = canvas.height + 10;
          s.life = 0;
        }
        const op = 0.2 * (0.5 + 0.5 * Math.sin(s.life * Math.PI * 3));
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2);
        grad.addColorStop(0, "rgba(232,126,160,0.12)");
        grad.addColorStop(1, "rgba(232,126,160,0)");
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.globalAlpha = op;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default SparkleField;