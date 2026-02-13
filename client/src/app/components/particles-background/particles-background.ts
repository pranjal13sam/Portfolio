import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-particles-background',
  standalone: true,
  templateUrl: './particles-background.html',
  styleUrl: './particles-background.css',
})
export class ParticlesBackground
  implements AfterViewInit, OnDestroy {

  // -----------------------------
  // Canvas reference (Angular version of useRef)
  // -----------------------------
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  // 2D drawing context
  private ctx!: CanvasRenderingContext2D;

  // Particle list
  private particles: Particle[] = [];

  // Animation id for cleanup
  private animationId = 0;

  // Total particles
  private readonly particleCount = 50;

  // Colors
  private readonly colors = ['rgba(255,255,255,0.7)'];

  // Resize handler reference
  private resizeHandler!: () => void;

  // ----------------------------------
  // Runs once DOM is ready
  // (like useEffect [])
  // ----------------------------------
  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    const context = canvas.getContext('2d');
    if (!context) return;

    this.ctx = context;

    // Setup size + particles
    this.setupResize(canvas);

    // Add resize listener
    window.addEventListener('resize', this.resizeHandler);

    // Start animation
    this.animate(canvas);
  }

  // ----------------------------------
  // Create particles
  // ----------------------------------
  private createParticles(canvas: HTMLCanvasElement): void {
    this.particles = [];

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(
        new Particle(canvas, this.ctx, this.colors)
      );
    }
  }

  // ----------------------------------
  // Resize canvas and regenerate particles
  // ----------------------------------
  private setupResize(canvas: HTMLCanvasElement): void {

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // recreate particles after resize
      this.createParticles(canvas);
    };

    this.resizeHandler = resize;

    resize(); // initial call
  }

  // ----------------------------------
  // Animation loop
  // ----------------------------------
  private animate(canvas: HTMLCanvasElement): void {

    const loop = () => {
      // clear screen
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      // update all particles
      this.particles.forEach((p: Particle) => p.update());

      // next frame
      this.animationId = requestAnimationFrame(loop);
    };

    loop();
  }

  // ----------------------------------
  // Cleanup (component destroy)
  // ----------------------------------
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    cancelAnimationFrame(this.animationId);
  }
}

/* ======================================================
   PARTICLE CLASS (outside component!)
====================================================== */

class Particle {

  private x: number;
  private y: number;
  private radius: number;
  private speedX: number;
  private speedY: number;
  private color: string;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    colors: string[]
  ) {
    // random start position
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    // random radius
    this.radius = Math.random() * 2 + 1;

    // random velocity
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;

    // random color
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  // ------------------
  // Draw particle
  // ------------------
  private draw(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  // ------------------
  // Move + wrap
  // ------------------
  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;

    // wrap screen edges
    if (this.x > this.canvas.width) this.x = 0;
    if (this.x < 0) this.x = this.canvas.width;

    if (this.y > this.canvas.height) this.y = 0;
    if (this.y < 0) this.y = this.canvas.height;

    this.draw();
  }
}