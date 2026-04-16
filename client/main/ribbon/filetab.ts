'use strict';

import RibbonTab, { RibbonItem } from './ribbontab';
import RibbonGroup from './ribbongroup';
import RibbonButton from './ribbonbutton';

export class FileTab extends RibbonTab {

    constructor() {
        super('file', 'F', _('File'));
        this.populate();
    }

    override getRibbonItems(): RibbonItem[] {
        let items: RibbonItem[] = [];

        let group1 = new RibbonGroup({ orientation: 'horizontal', position: 'top' });

        group1.addItem(new RibbonButton({
            name: 'new',
            title: _('New'),
            size: 'large',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 8,9 8,7 10,7"></polyline></svg>',
            shortcutKey: 'N',
        }));

        group1.addItem(new RibbonButton({
            name: 'open',
            title: _('Open'),
            size: 'large',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
            shortcutKey: 'O',
        }));

        group1.addItem(new RibbonButton({
            name: 'import',
            title: _('Special'),
            subtitle: _('Import'),
            size: 'large',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line><line x1="19" y1="12" x2="12" y2="5"></line></svg>',
            shortcutKey: 'I',
        }));

        items.push(group1);

        let group2 = new RibbonGroup({ orientation: 'horizontal', position: 'top' });

        group2.addItem(new RibbonButton({
            name: 'save',
            title: _('Save'),
            size: 'large',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
            shortcutKey: 'S',
        }));

        group2.addItem(new RibbonButton({
            name: 'saveAs',
            title: _('Save'),
            subtitle: _('As'),
            size: 'large',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline><line x1="14" y1="1" x2="14" y2="8"></line><line x1="11" y1="4" x2="17" y2="4"></line></svg>',
        }));

        group2.addItem(new RibbonButton({
            name: 'export',
            title: _('Export'),
            size: 'large',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>',
            shortcutKey: 'E',
        }));

        items.push(group2);

        let group3 = new RibbonGroup({ orientation: 'horizontal', position: 'top' });

        group3.addItem(new RibbonButton({
            name: 'addRow',
            title: _('Insert'),
            subtitle: _('Row'),
            size: 'medium',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        }));

        group3.addItem(new RibbonButton({
            name: 'appendRow',
            title: _('Append'),
            subtitle: _('Row'),
            size: 'medium',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="19 12 14 17 14 12 14 7"></polyline></svg>',
        }));

        group3.addItem(new RibbonButton({
            name: 'removeRow',
            title: _('Delete'),
            subtitle: _('Rows'),
            size: 'medium',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        }));

        items.push(group3);

        let group4 = new RibbonGroup({ orientation: 'horizontal', position: 'top' });

        group4.addItem(new RibbonButton({
            name: 'addVariable',
            title: _('Insert'),
            subtitle: _('Variable'),
            size: 'medium',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        }));

        group4.addItem(new RibbonButton({
            name: 'appendVariable',
            title: _('Append'),
            subtitle: _('Variable'),
            size: 'medium',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="19 12 14 17 14 12 14 7"></polyline></svg>',
        }));

        group4.addItem(new RibbonButton({
            name: 'computeVariable',
            title: _('Compute'),
            subtitle: _('Variable'),
            size: 'medium',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><polyline points="10.5 12.5 12.5 10.5 14.5 12.5"></polyline><polyline points="9.5 14.5 10.5 12.5 11.5 14.5"></polyline></svg>',
        }));

        items.push(group4);

        return items;
    }
}

export default FileTab;
