
const TABBAR_POSITION_START = 'start';
const TABBAR_POSITION_CENTER = 'center';
const TABBAR_POSITION_END = 'end';

class Tabbar {
        html;
        parent;
        tabs;

        constructor(parentSelector) {
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