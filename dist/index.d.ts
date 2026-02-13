declare class BBImg extends HTMLElement {
    private observer;
    private img;
    private isLoaded;
    private loadId;
    static get observedAttributes(): string[];
    constructor();
    private get container();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private cleanup;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private updatePlaceholderColor;
    private updateMaxWidth;
    private resetAndLoad;
    render(): void;
    setupLazyLoading(): void;
    private isInViewport;
    loadImage(): void;
    private showError;
    reload(): void;
    get loaded(): boolean;
}
export { BBImg };
declare global {
    interface HTMLElementTagNameMap {
        'bb-img': BBImg;
    }
}
