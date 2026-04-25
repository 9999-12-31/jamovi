'use strict';

/**
 * AI Assistant Floating Button Component
 * 
 * A floating action button that opens an AI assistant panel with embedded URL.
 * 
 * Usage:
 *   <jmv-ai-assistant url="https://your-ai-assistant-url.com"></jmv-ai-assistant>
 */

const DEFAULT_URL = '';

/** Check if AI assistant URL is configured */
function isAiAssistantConfigured(): boolean {
    if (typeof window !== 'undefined' && (window as any).config?.client?.aiAssistantUrl) {
        return !!((window as any).config.client.aiAssistantUrl.trim());
    }
    return false;
}

/** Get AI assistant URL from config */
function getAiAssistantUrl(): string {
    if (isAiAssistantConfigured()) {
        return (window as any).config.client.aiAssistantUrl;
    }
    return DEFAULT_URL;
}

class AiAssistant extends HTMLElement {
    // DOM elements
    private fab: HTMLButtonElement | null = null;
    private overlay: HTMLDivElement | null = null;
    private panel: HTMLDivElement | null = null;
    private iframe: HTMLIFrameElement | null = null;
    
    // State
    private isLoading: boolean = false;
    private isOpen: boolean = false;

    static get observedAttributes() {
        return ['url'];
    }

    constructor() {
        super();
        this._togglePanel = this._togglePanel.bind(this);
        this._closePanel = this._closePanel.bind(this);
        this._handleIframeLoad = this._handleIframeLoad.bind(this);
    }

    connectedCallback() {
        // Don't render if no URL is configured
        if (!isAiAssistantConfigured()) {
            this.style.display = 'none';
            return;
        }
        this._render();
        this._bindEvents();
    }

    disconnectedCallback() {
        this._unbindEvents();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'url' && newValue && this.iframe) {
            this.iframe.src = newValue;
        }
    }

    /** Get assistant URL from attribute or config */
    private get assistantUrl(): string {
        return this.getAttribute('url') || getAiAssistantUrl();
    }

    // ==================== Render ====================

    private _render() {
        this._createFab();
        this._createOverlay();
        this._createPanel();
        this._appendToBody();
        this._cacheIframe();
        this._bindIframeEvents();
    }

    private _createFab() {
        this.fab = document.createElement('button');
        this.fab.id = 'ai-assistant-fab';
        this.fab.setAttribute('aria-label', 'AI 助手');
        this.fab.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="12" rx="3" fill="white"/>
                <circle cx="9" cy="12" r="1.5" fill="#0056b5"/>
                <circle cx="15" cy="12" r="1.5" fill="#0056b5"/>
                <path d="M8 15.5C8 15.5 9.5 17 12 17C14.5 17 16 15.5 16 15.5" stroke="#0056b5" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 2V4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="12" cy="2" r="0.5" fill="white"/>
                <rect x="5" y="8" width="2" height="2" rx="0.5" fill="#0070e0"/>
                <rect x="17" y="8" width="2" height="2" rx="0.5" fill="#0070e0"/>
            </svg>
        `;
    }

    private _createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'ai-assistant-overlay';
    }

    private _createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'ai-assistant-panel';
        this.panel.innerHTML = `
            <div id="ai-assistant-header">
                <h3>AI 助手</h3>
                <button id="ai-assistant-close" aria-label="关闭">×</button>
            </div>
            <div id="ai-assistant-body">
                <div id="ai-assistant-loading">
                    <div class="spinner"></div>
                    <div>加载中...</div>
                </div>
                <iframe 
                    src="${this.assistantUrl}" 
                    loading="lazy"
                    allow="microphone; camera; clipboard-read; clipboard-write"
                    allowtransparency="true"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                    title="AI 助手"
                ></iframe>
            </div>
        `;
    }

    private _appendToBody() {
        document.body.appendChild(this.fab);
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.panel);
    }

    private _cacheIframe() {
        this.iframe = this.panel.querySelector('iframe') as HTMLIFrameElement;
    }

    private _bindIframeEvents() {
        if (this.iframe) {
            this.iframe.addEventListener('load', this._handleIframeLoad);
        }
    }

    // ==================== Events ====================

    private _bindEvents() {
        this.fab?.addEventListener('click', this._togglePanel);
        
        const closeBtn = this.panel?.querySelector('#ai-assistant-close');
        closeBtn?.addEventListener('click', this._closePanel);

        document.addEventListener('keydown', this._handleKeyDown);
    }

    private _unbindEvents() {
        this.fab?.removeEventListener('click', this._togglePanel);
        
        const closeBtn = this.panel?.querySelector('#ai-assistant-close');
        closeBtn?.removeEventListener('click', this._closePanel);

        document.removeEventListener('keydown', this._handleKeyDown);
    }

    private _handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.isOpen) {
            this._closePanel();
        }
    }

    // ==================== Panel Control ====================

    private _togglePanel() {
        this.isOpen ? this._closePanel() : this._openPanel();
    }

    private _openPanel() {
        this.isOpen = true;
        this.isLoading = true;

        this.fab?.classList.add('active');
        this.overlay?.classList.add('visible');
        this.panel?.classList.add('visible');
    }

    private _closePanel() {
        this.isOpen = false;

        this.fab?.classList.remove('active');
        this.overlay?.classList.remove('visible');
        this.panel?.classList.remove('visible');
    }

    private _handleIframeLoad() {
        this.isLoading = false;
        const loading = this.panel?.querySelector('#ai-assistant-loading');
        loading?.style.setProperty('display', 'none');
    }

    // ==================== Public API ====================

    public open() {
        if (!this.isOpen) {
            this._openPanel();
        }
    }

    public close() {
        if (this.isOpen) {
            this._closePanel();
        }
    }

    public toggle() {
        this._togglePanel();
    }

    public setUrl(url: string) {
        this.setAttribute('url', url);
        this.iframe && (this.iframe.src = url);
    }
}

// Register custom element
if (!customElements.get('jmv-ai-assistant')) {
    customElements.define('jmv-ai-assistant', AiAssistant);
}

export default AiAssistant;
