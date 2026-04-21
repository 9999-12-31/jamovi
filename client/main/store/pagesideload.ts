//
// Copyright (C) 2016 Jonathon Love
//

'use strict';

import host, { baseUrl } from '../host';
import { Modules } from '../modules';
import Notify from '../notification';
import { HTMLElementCreator as HTML }  from '../../common/htmlelementcreator';

class PageSideload extends HTMLElement {
    model: Modules;
    $body: HTMLElement;
    $drop: HTMLButtonElement;
    _fileInput: HTMLInputElement;

    constructor(model: Modules) {
        super();

        this.model = model;
        this.classList.add('PageSideload');
        this.classList.add('jmv-store-page-sideload');
        this.setAttribute('role', 'tabpanel');
        this.$body = HTML.parse('<div class="jmv-store-body"></div>');
        this.append(this.$body);
        this.$drop = HTML.parse<HTMLButtonElement>('<button class="jmv-store-page-installed-drop" tabindex="-1"><span class="mif-file-upload"></span></button>');
        this.$body.append(this.$drop);
        this.$drop.addEventListener('click', event => this._dropClicked());

        // Hidden file input for browser-based file selection
        this._fileInput = document.createElement('input');
        this._fileInput.type = 'file';
        this._fileInput.accept = '.jmo,.zip';
        this._fileInput.style.display = 'none';
        this._fileInput.addEventListener('change', () => this._fileSelected());
        this.appendChild(this._fileInput);
    }

    async _dropClicked() {
        if (host.isElectron) {
            let filters = [ { name: _('jamovi modules'), extensions: ['jmo']} ];
            let result = await host.showOpenDialog({ filters });

            if ( ! result.cancelled) {
                const path = result.paths[0];
                try {
                    await this.model.install(path);
                    this._installSuccess();
                }
                catch (e) {
                    this._installFailure(e);
                }
            }

            this.$drop.focus();
        }
        else {
            // Browser mode: trigger hidden file input
            this._fileInput.value = '';
            this._fileInput.click();
        }
    }

    async _fileSelected() {
        const file = this._fileInput.files[0];
        if (!file)
            return;

        try {
            await this._uploadAndInstall(file);
            this._installSuccess();
        }
        catch (e) {
            this._installFailure(e);
        }

        this.$drop.focus();
    }

    async _uploadAndInstall(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${baseUrl}modules/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(result.error || 'Upload failed');
            throw error;
        }

        // Refresh the module list after installation
        return new Promise<void>((resolve, reject) => {
            const onModulesChanged = () => {
                this.model.off('change:modules', onModulesChanged);
                resolve();
            };
            this.model.on('change:modules', onModulesChanged);
        });
    }

    _installSuccess() {
        this.dispatchEvent(new CustomEvent('notification', { detail: new Notify({
            title: _('Module installed successfully'),
            message: '',
            duration: 3000,
            type: 'success'
        }), bubbles: true}));
        this.dispatchEvent(new CustomEvent('close'));
    }

    _installFailure(error) {
        this.dispatchEvent(new CustomEvent('notification', { detail: new Notify({
            message: error.message,
            title: _('Unable to install module'),
            duration: 4000,
            type: 'error'
        }), bubbles: true}));
    }
}

customElements.define('jmv-sideload', PageSideload);

export default PageSideload;
