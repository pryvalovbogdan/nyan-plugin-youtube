import { PopupModule } from './PopupModule.js';

const COLORS = ['#ff4466', '#ff8800', '#ffdd00', '#44dd44', '#44aaff', '#cc44ff', '#ff66bb'];

export class HeartAnimationModule extends PopupModule {
  #interval = null;

  #spawnHeart(btn) {
    const rect = btn.getBoundingClientRect();
    const heart = document.createElement('span');

    heart.className = 'heart-particle';
    heart.textContent = '♥';

    const x = Math.random() * (rect.width - 16) + 4;
    const size = 10 + Math.random() * 8;
    const duration = 0.7 + Math.random() * 0.5;
    const drift = (Math.random() - 0.5) * 24;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    heart.style.cssText = `left:${x}px;bottom:4px;font-size:${size}px;color:${color};--duration:${duration}s;--drift:${drift}px`;

    btn.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  init() {
    const btn = document.getElementById('rateUsBtn');

    if (!btn) return;

    btn.addEventListener('mouseenter', () => {
      this.#spawnHeart(btn);
      this.#interval = setInterval(() => this.#spawnHeart(btn), 180);
    });

    btn.addEventListener('mouseleave', () => {
      clearInterval(this.#interval);
      this.#interval = null;
    });
  }
}
