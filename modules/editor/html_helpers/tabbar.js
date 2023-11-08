
import { HtmlElement } from './html_element.js';
import { TabbarTab } from './tabbar_tab.js';

export const TABBAR_POSITION_START = 'start';
export const TABBAR_POSITION_CENTER = 'center';
export const TABBAR_POSITION_END = 'end';

export class Tabbar {
        /*
         * constructor
         * @param string parentSelect: HTML selector for the parent element
         */
        constructor(parentSelector) {
                this.parent = document.querySelector(parentSelector);
                this.tabs = [];

                // create wrapper element
                this.html = new HtmlElement('div', null, {class: 'tabbar row'});

                this.parent.appendChild(this.html);
        }

        /*
         * adds a tab to this tabbar
         * @param string id: id for this tab - used to identify this tab (should be unique)
         * @param string title: title that is displayed inside tab
         * @param string icon: FontAwesome icon name that is displayed next to the title
         * @param HTMLNode[] dropdown: array of dropdown items - tag, content, attributes
         * @param string position: position of the tab
         */
        addTab(id, title, icon = null, dropdown = null, position = TABBAR_POSITION_START) {
                const tab = new TabbarTab(id, title, icon, dropdown, position);

                this.tabs[tab.id] = tab;
                this.html.appendChild(tab.html);
        }
}