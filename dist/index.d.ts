declare class BBImg extends HTMLElement {
    private observer;
    private img;
    private isLoaded;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    render(): void;
    setupLazyLoading(): void;
    loadImage(): void;
    updateImage(): void;
}
export { BBImg };
