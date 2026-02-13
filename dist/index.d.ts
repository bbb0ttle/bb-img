declare class BBImg extends HTMLElement {
    private observer;
    private resizeObserver;
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
     */
    private normalizeMaxWidth;
    /**
     * 根据实际容器宽度计算最小高度
     */
    private calculateMinHeight;
    /**
     * 更新容器的 min-height 基于实际渲染宽度
     */
    private updateMinHeight;
    /**
     * 设置 ResizeObserver 监听容器宽度变化
     */
    private setupResizeObserver;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private updatePlaceholderColor;
    private updateMaxWidth;
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
