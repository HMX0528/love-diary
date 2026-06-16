import { useEffect, useRef } from 'react'

const LoveParticles = ({ count = 40 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() {
        this.reset()
      }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 12 + 4
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5 - 0.3
        this.opacity = Math.random() * 0.4 + 0.15
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.pulse = Math.random() * Math.PI * 2
        this.pulseSpeed = Math.random() * 0.02 + 0.005
        this.life = 1
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed
        this.pulse += this.pulseSpeed
        this.life -= 0.001

        if (this.life <= 0 || this.y < -50 || this.y > canvas.height + 50) {
          this.reset()
          this.life = 1
        }
        if (this.x < -50) this.x = canvas.width + 50
        if (this.x > canvas.width + 50) this.x = -50
      }
      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        const scale = 1 + Math.sin(this.pulse) * 0.15
        ctx.scale(scale, scale)

        const currentOpacity = this.opacity * this.life
        ctx.globalAlpha = currentOpacity
        ctx.fillStyle = '#e87ea0'

        ctx.beginPath()
        const s = this.size * 0.5
        ctx.moveTo(0, s * 0.3)
        ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.3, -s, 0, -s * 0.3)
        ctx.bezierCurveTo(s * 0.3, -s, s, -s * 0.3, 0, s * 0.3)
        ctx.fill()

        ctx.restore()
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default LoveParticles
