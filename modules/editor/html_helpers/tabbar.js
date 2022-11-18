
import { HtmlElement } from './html_element.js';
import { TabbarTab } from './tabbar_tab.js';

export const TABBAR_POSITION_START = 'start';
export const TABBAR_POSITION_CENTER = 'center';
export const TABBAR_POSITION_END = 'end';

export class Tabbar {
        html;
        parent;
        tabs;

        constructor(parentSelector) {console.log(parentSelector);
                this.parent = document.querySelector(parentSelector);
                this.tabs = [];

                // create wrapper element
                this.html = new HtmlElement('div', null, {class: 'tabbar row'});

                this.parent.appendChild(this.html);
        }

        addTab(id, title, icon = null, dropdown = null, position = TABBAR_POSITION_START) {
                let tab = new TabbarTab(id, title, icon, dropdown, position);

                this.tabs[tab.id] = tab;
                this.html.appendChild(tab.html);
        }
}