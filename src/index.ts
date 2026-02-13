class BBImg extends HTMLElement {
  private observer: IntersectionObserver | null = null;
  private img: HTMLImageElement | null = null;
  private isLoaded = false;
  private loadId = 0;
  private aspectRatio: number = 3 / 2; // 默认 3:2

  static get observedAttributes() {
    return ['src', 'alt', 'placeholder', 'max-width', 'root-margin', 'aspect-ratio'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  private get container(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.container') ?? null;
  }

  connectedCallback() {
    this.parseAspectRatio();
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

  private parseAspectRatio() {
    const ratio = this.getAttribute('aspect-ratio');
    if (ratio) {
      const [w, h] = ratio.split('/').map(Number);
      if (w && h) {
        this.aspectRatio = w / h;
      }
    }
  }

  /**
   * 标准化 max-width 值：纯数字默认转为 px
   * "500" -> "500px", "100%" -> "100%", "800px" -> "800px"
   */
  private normalizeMaxWidth(value: string | null): string {
    if (!value) return '100%';
    // 如果是纯数字（整数或小数），添加 px 单位
    if (/^\d+(\.\d+)?$/.test(value.trim())) {
      return `${value}px`;
    }
    return value;
  }

  private getMinHeight(): string {
    const rawMaxWidth = this.getAttribute('max-width');
    const maxWidth = this.normalizeMaxWidth(rawMaxWidth);
    
    // 如果是百分比，使用视口宽度计算最小高度
    if (maxWidth.endsWith('%')) {
      const percent = parseFloat(maxWidth) / 100;
      const vwHeight = (100 * percent) / this.aspectRatio;
      return `min(${vwHeight}vw, ${300 / this.aspectRatio}px)`; // 设置上限防止过大
    }
    
    // 如果是 px 或其他单位，直接计算
    if (maxWidth.endsWith('px')) {
      const width = parseFloat(maxWidth);
      return `${width / this.aspectRatio}px`;
    }
    
    // 默认使用 vw 计算，确保有最小高度
    return `${100 / this.aspectRatio}vw`;
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
        this.updateMinHeight();
        break;
      case 'aspect-ratio':
        this.parseAspectRatio();
        this.updateAspectRatio();
        break;
    }
  }

  private updatePlaceholderColor(color: string | null) {
    const container = this.container;
    if (container && !this.isLoaded) {
      container.style.backgroundColor = color || '#f5f5f5';
    }
  }

  private updateMaxWidth(value: string | null) {
    const maxWidth = this.normalizeMaxWidth(value);
    this.style.maxWidth = maxWidth;
    const container = this.container;
    if (container) {
      container.style.maxWidth = maxWidth;
    }
  }

  private updateMinHeight() {
    const container = this.container;
    if (container) {
      const minHeight = this.getMinHeight();
      container.style.minHeight = minHeight;
    }
  }

  private updateAspectRatio() {
    const container = this.container;
    if (container) {
      container.style.aspectRatio = `${this.aspectRatio}`;
      this.updateMinHeight();
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

    const container = this.container;
    if (container) {
      container.classList.remove('loaded');
      container.style.backgroundColor = this.getAttribute('placeholder') || '#f5f5f5';
    }

    if (this.observer) {
      this.observer.disconnect();
    }
    this.setupLazyLoading();
  }

  render() {
    const alt = this.getAttribute('alt') || '';
    const placeholderColor = this.getAttribute('placeholder') || '#f5f5f5';
    const rawMaxWidth = this.getAttribute('max-width');
    const maxWidth = this.normalizeMaxWidth(rawMaxWidth);
    const minHeight = this.getMinHeight();

    this.style.maxWidth = maxWidth;
    this.style.display = 'block';

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          max-width: ${maxWidth};
          margin: 0 auto;
        }
        
        .container {
          position: relative;
          width: 100%;
          max-width: ${maxWidth};
          aspect-ratio: ${this.aspectRatio};
          min-height: ${minHeight}; /* 关键修复：确保加载前高度不为0 */
          background-color: ${placeholderColor};
          overflow: hidden;
          margin: 0 auto;
          /* 极淡的骨架屏：几乎不可察觉 */
          transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* 极简骨架屏：极淡的呼吸感 */
        .container:not(.loaded)::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(128, 128, 128, 0.03) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: breathe 3s ease-in-out infinite;
        }
        
        @keyframes breathe {
          0%, 100% { 
            transform: translateX(-100%);
            opacity: 0;
          }
          50% { 
            transform: translateX(100%);
            opacity: 1;
          }
        }
        
        .container.loaded {
          background-color: transparent;
        }
        
        .container.loaded::before {
          animation: none;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          /* 更长的过渡时间，更自然的缓动 */
          transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(1.02);
          will-change: opacity, transform;
          decoding: async;
        }
        
        img.loaded {
          opacity: 1;
          transform: scale(1);
        }
        
        /* 极简错误状态 */
        .error {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #ccc;
          font-size: 13px;
          letter-spacing: 0.05em;
        }
        
        .error-icon {
          width: 32px;
          height: 32px;
          opacity: 0.3;
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
        // 静默失败，继续显示
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
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" 
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