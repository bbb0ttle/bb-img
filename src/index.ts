class BBImg extends HTMLElement {
  private observer: IntersectionObserver | null = null;
  private img: HTMLImageElement | null = null;
  private isLoaded = false;
  private loadId = 0;

  static get observedAttributes() {
    return ['src', 'alt', 'placeholder', 'max-width', 'root-margin'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  private get container(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.container') ?? null;
  }

  connectedCallback() {
    this.render();
    this.setupLazyLoading();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  private cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.img) {
      this.img.onload = null;
      this.img.onerror = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'src':
        if (this.isConnected) this.resetAndLoad();
        break;
      case 'alt':
        if (this.img) this.img.alt = newValue || '';
        break;
      case 'placeholder':
        this.updatePlaceholderColor(newValue);
        break;
      case 'max-width':
        this.updateMaxWidth(newValue);
        break;
      case 'root-margin':
        // 仅影响下次懒加载初始化，无需立即处理
        break;
    }
  }

  private updatePlaceholderColor(color: string | null) {
    const container = this.container;
    if (container && !this.isLoaded) {
      container.style.backgroundColor = color || '#dfdfdf';
    }
  }

  private updateMaxWidth(value: string | null) {
    const maxWidth = value || '100%';
    // 更新 host 和 container 的 max-width
    this.style.maxWidth = maxWidth;
    const container = this.container;
    if (container) {
      container.style.maxWidth = maxWidth;
    }
  }

  private resetAndLoad() {
    this.isLoaded = false;
    this.loadId++;

    if (this.img) {
      this.img.classList.remove('loaded');
      this.img.onload = null;
      this.img.onerror = null;
      this.img.removeAttribute('src');
    }

    this.container?.classList.remove('loaded');

    if (this.observer) {
      this.observer.disconnect();
    }
    this.setupLazyLoading();
  }

  render() {
    const alt = this.getAttribute('alt') || '';
    const placeholderColor = this.getAttribute('placeholder') || '#dfdfdf';
    const maxWidth = this.getAttribute('max-width') || '100%';
    const rootMargin = this.getAttribute('root-margin') || '50px';

    // 应用 max-width 到 host
    this.style.maxWidth = maxWidth;
    this.style.display = 'block';

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          max-width: ${maxWidth};
          margin: 0 auto; /* 居中显示 */
        }
        .container {
          position: relative;
          width: 100%;
          max-width: ${maxWidth};
          aspect-ratio: 3/2;
          background-color: ${placeholderColor};
          overflow: hidden;
          margin: 0 auto;
        }
        /* 骨架屏脉冲动画 */
        .container:not(.loaded)::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .container.loaded {
          background-color: transparent;
        }
        .container.loaded::after {
          display: none;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          decoding: async;
        }
        img.loaded {
          opacity: 1;
        }
        .error {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #999;
          font-size: 14px;
        }
        .error-icon {
          width: 48px;
          height: 48px;
          opacity: 0.5;
        }
      </style>
      <div class="container">
        <img alt="${alt}" />
      </div>
    `;
    this.img = this.shadowRoot!.querySelector('img');
  }

  setupLazyLoading() {
    if (!('IntersectionObserver' in window) || this.isInViewport()) {
      this.loadImage();
      return;
    }

    const rootMargin = this.getAttribute('root-margin') || '50px';

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoaded) {
            this.loadImage();
            this.observer?.disconnect();
            this.observer = null;
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    this.observer.observe(this);
  }

  private isInViewport(): boolean {
    const rect = this.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  loadImage() {
    const src = this.getAttribute('src');
    if (!src || !this.img) return;

    const currentLoadId = ++this.loadId;
    this.isLoaded = true;

    this.img.onload = async () => {
      if (currentLoadId !== this.loadId) return;

      try {
        if ('decode' in this.img!) {
          await this.img!.decode();
        }
      } catch {
        // decode 失败继续显示
      }

      this.img!.classList.add('loaded');
      this.container?.classList.add('loaded');
    };

    this.img.onerror = () => {
      if (currentLoadId !== this.loadId) return;
      console.error(`Failed to load image: ${src}`);
      this.showError();
    };

    this.img.src = src;
  }

  private showError() {
    const container = this.container;
    if (!container) return;

    container.innerHTML = `
      <div class="error">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    `;
    container.classList.add('loaded');
  }

  reload() {
    this.resetAndLoad();
  }

  get loaded() {
    return this.isLoaded;
  }
}

customElements.define('bb-img', BBImg);

export { BBImg };

declare global {
  interface HTMLElementTagNameMap {
    'bb-img': BBImg;
  }
}