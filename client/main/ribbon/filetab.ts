
'use strict';

import RibbonButton from './ribbonbutton';
import RibbonSeparator from './ribbonseparator';
import RibbonGroup from './ribbongroup';
import RibbonTab from './ribbontab';

export class FileTab extends RibbonTab {

    constructor() {
        super('file', 'F', _('File'));

        this.populate();
    }

    override getRibbonItems() {
        return [
            new RibbonGroup({ title: _('New'), margin: 'large', items: [
                new RibbonButton({ title: _('New'), ariaLabel: _('Create new project'), name: 'new', margin: 'large', size: 'large', shortcutKey: 'n', shortcutPosition: { x: '50%', y: '90%' } }),
            ]}),
            new RibbonSeparator(),
            new RibbonGroup({ title: _('Open'), margin: 'large', items: [
                new RibbonButton({ title: _('Open'), ariaLabel: _('Open a data file'), name: 'open', margin: 'large', size: 'large', shortcutKey: 'o', shortcutPosition: { x: '50%', y: '90%' }, subItems: [
                    new RibbonGroup({ title: _('Places'), orientation: 'vertical', titlePosition: 'top', items: [
                        new RibbonButton({ title: _('This PC'), name: 'openThisPC', shortcutKey: 'p', shortcutPosition: { x: '25px', y: '55%' } }),
                        new RibbonButton({ title: _('Data Library'), name: 'openExamples', shortcutKey: 'l', shortcutPosition: { x: '25px', y: '55%' } }),
                    ]}),
                ]}),
            ]}),
            new RibbonSeparator(),
            new RibbonGroup({ title: _('Save'), margin: 'large', items: [
                new RibbonButton({ title: _('Save'), ariaLabel: _('Save project'), name: 'save', margin: 'large', size: 'large', shortcutKey: 's', shortcutPosition: { x: '50%', y: '90%' } }),
                new RibbonButton({ title: _('Save As'), ariaLabel: _('Save project as'), name: 'saveAs', margin: 'large', size: 'large', shortcutKey: 'a', shortcutPosition: { x: '50%', y: '90%' } }),
            ]}),
            new RibbonSeparator(),
            new RibbonGroup({ title: _('Transfer'), margin: 'large', items: [
                new RibbonButton({ title: _('Import'), ariaLabel: _('Import data'), name: 'import', margin: 'large', size: 'large', shortcutKey: 'i', shortcutPosition: { x: '50%', y: '90%' } }),
                new RibbonButton({ title: _('Export'), ariaLabel: _('Export results'), name: 'export', margin: 'large', size: 'large', shortcutKey: 'e', shortcutPosition: { x: '50%', y: '90%' } }),
            ]}),
        ];
    }
}

export default FileTab;
