'use strict';

import { BackstageModel } from './backstage';
import { FSEntryBrowserView } from './backstage/fsentrybrowserview';
import { HTMLElementCreator as HTML } from '../common/htmlelementcreator';
import focusLoop from '../common/focusloop';
import path from 'path';

export class FilePanel extends HTMLElement {

    model: BackstageModel;
    currentBrowser: FSEntryBrowserView | null = null;

    $header: HTMLElement;
    $title: HTMLElement;
    $closeButton: HTMLElement;
    $content: HTMLElement;
    $placeTabs: HTMLElement;

    _currentOp: string | null = null;
    _currentPlaceName: string | null = null;

    constructor() {
        super();
    }

    setup(model: BackstageModel) {
        this.model = model;
        this.classList.add('jmv-file-panel', 'hidden');

        // Build DOM
        this.$header = HTML.parse('<div class="jmv-file-panel-header"></div>');
        this.$title = HTML.parse('<div class="jmv-file-panel-title"></div>');
        this.$closeButton = HTML.parse(`<button class="jmv-file-panel-close" aria-label="${_('Close')}"><span class="mif-arrow-up"></span></button>`);
        this.$placeTabs = HTML.parse('<div class="jmv-file-panel-place-tabs"></div>');

        this.$header.append(this.$title);
        this.$header.append(this.$placeTabs);
        this.$header.append(this.$closeButton);

        this.$content = HTML.parse('<div class="jmv-file-panel-content"></div>');

        this.append(this.$header);
        this.append(this.$content);

        // Close button handler
        this.$closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Listen for model changes to update tabs/title
        this.model.on('change:place', this._onModelPlaceChanged, this);
        this.model.on('change:operation', this._onModelOpChanged, this);
    }

    show(op: string) {
        this._currentOp = op;

        // Ensure BackstageView is not activated
        if (this.model.get('activated')) {
            this.model.set('activated', false);
        }

        // Set the operation on the model — this triggers _opChanged which sets places
        this.model.set('operation', op);

        this._updateTitle();
        this._updatePlaceTabs();
        this._renderBrowser();

        this.classList.remove('hidden');
        this.dispatchEvent(new CustomEvent('visibility-changing', { detail: true, bubbles: true }));
    }

    hide() {
        this._currentOp = null;
        this._currentPlaceName = null;
        this.classList.add('hidden');
        // Don't reset model operation/place — that would interfere with BackstageView
        // The model state will be reset when another tab is selected
        this.dispatchEvent(new CustomEvent('visibility-changing', { detail: false, bubbles: true }));
    }

    isOpen(): boolean {
        return !this.classList.contains('hidden');
    }

    /** Respond to model's operation change */
    _onModelOpChanged() {
        if (!this.isOpen()) return;
        this._updateTitle();
        this._updatePlaceTabs();
        this._renderBrowser();
    }

    /** Respond to model's place change */
    _onModelPlaceChanged() {
        if (!this.isOpen()) return;
        let currentPlace = this.model.get('place');
        if (currentPlace !== this._currentPlaceName) {
            this._currentPlaceName = currentPlace;
            this._updatePlaceTabs();
            this._renderBrowser();
        }
    }

    /** Update the panel title from the current operation */
    _updateTitle() {
        let op = this.model.getCurrentOp();
        if (op) {
            this.$title.textContent = op.title;
        } else {
            this.$title.textContent = '';
        }
    }

    /** Update the place tabs from the current operation's places */
    _updatePlaceTabs() {
        this.$placeTabs.innerHTML = '';

        let currentOp = this.model.getCurrentOp();
        if (!currentOp || !currentOp.places) {
            this.$placeTabs.style.display = 'none';
            return;
        }

        if (currentOp.places.length <= 1) {
            this.$placeTabs.style.display = 'none';
            return;
        }

        this.$placeTabs.style.display = 'flex';

        let currentPlace = this.model.get('place');

        for (let place of currentOp.places) {
            let tab = HTML.parse(`<button class="jmv-file-panel-place-tab" data-place="${place.name}">${place.title}</button>`) as HTMLElement;

            if (place.name === currentPlace) {
                tab.classList.add('active');
            }

            tab.addEventListener('click', () => {
                // Execute the place's action if it has one
                if (place.action) {
                    place.action();
                }
                // Update model place
                this.model.set('lastSelectedPlace', place.name);
                this.model.set('place', place.name);
            });

            this.$placeTabs.append(tab);
        }
    }

    /** Render the FSEntryBrowserView for the current place */
    _renderBrowser() {
        // Remove existing browser
        if (this.currentBrowser) {
            this.currentBrowser.remove();
            this.currentBrowser = null;
        }

        let currentOp = this.model.getCurrentOp();
        if (!currentOp || !currentOp.places) return;

        let placeName = this.model.get('place');
        let place = null;
        for (let p of currentOp.places) {
            if (p.name === placeName) {
                place = p;
                break;
            }
        }

        if (!place) {
            // Default to first place with a view
            for (let p of currentOp.places) {
                if (p.model && p.view !== undefined) {
                    place = p;
                    break;
                }
            }
        }

        if (!place || !place.model) return;

        // Create our own FSEntryBrowserView instance
        // This avoids sharing DOM elements with BackstageView's BackstageChoices
        let browser = new FSEntryBrowserView(place.model);
        browser.classList.add('jmv-file-panel-browser');
        this.currentBrowser = browser;
        this.$content.append(browser);
        this._currentPlaceName = placeName;

        // Ensure the working directory is set
        if (this.model.hasCurrentDirectory(place.model.attributes.wdType) === false) {
            if (place.model.attributes.wdType === 'thispc') {
                let filePath = this.model._determineSavePath('main');
                this.model.setCurrentDirectory('main', path.dirname(filePath));
            }
            else {
                this.model.setCurrentDirectory(place.model.attributes.wdType, '', null, place.model.writeOnly);
            }
        }

        // Trigger fade-in
        setTimeout(() => {
            browser.classList.add('fade-in');
        }, 0);
    }

    disconnectedCallback() {
        this.model.off('change:place', this._onModelPlaceChanged, this);
        this.model.off('change:operation', this._onModelOpChanged, this);
    }
}

customElements.define('jmv-file-panel', FilePanel);

export default FilePanel;
