class BBImg extends HTMLElement {
  private observer: IntersectionObserver | null = null;
  private img: HTMLImageElement | null = null;
  private isLoaded = false;

  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupLazyLoading();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'src' && oldValue !== newValue && this.isConnected) {
      this.updateImage();
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
        }
        .container {
          position: relative;
          width: 100%;
          aspect-ratio: 2/3;
          background-color: #d3d3d3;
          overflow: hidden;
        }
        .container.loaded {
          background-color: transparent;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        img.loaded {
          opacity: 1;
        }
      </style>
      <div class="container">
        <img />
      </div>
    `;
    this.img = this.shadowRoot!.querySelector('img');
  }

  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      this.loadImage();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoaded) {
            this.loadImage();
            if (this.observer) {
              this.observer.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    this.observer.observe(this);
  }

  loadImage() {
    const src = this.getAttribute('src');
    if (!src || !this.img) return;

    this.isLoaded = true;
    this.img.onload = () => {
      this.img!.classList.add('loaded');
      const container = this.shadowRoot!.querySelector('.container');
      if (container) {
        container.classList.add('loaded');
      }
    };

    this.img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };

    this.img.src = src;
  }

  updateImage() {
    this.isLoaded = false;
    if (this.img) {
      this.img.classList.remove('loaded');
      const container = this.shadowRoot!.querySelector('.container');
      if (container) {
        container.classList.remove('loaded');
      }
    }
    this.loadImage();
  }
}

customElements.define('bb-img', BBImg);

export { BBImg };
