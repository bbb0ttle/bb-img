declare class BBImg extends HTMLElement {
    private observer;
    private img;
    private isLoaded;
    private loadId;
    private aspectRatio;
    static get observedAttributes(): string[];
    constructor();
    private get container();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private cleanup;
    private parseAspectRatio;
    /**
     * 标准化 max-width 值：纯数字默认转为 px
     * "500" -> "500px", "100%" -> "100%", "800px" -> "800px"
     */
    private normalizeMaxWidth;
    private getMinHeight;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private updatePlaceholderColor;
    private updateMaxWidth;
    private updateMinHeight;
    private updateAspectRatio;
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
