
import { HtmlElement } from './html_element.js';
import { TABBAR_POSITION_START, TABBAR_POSITION_CENTER, TABBAR_POSITION_END } from './tabbar.js';

export class TabbarTab {
        html;
        title;
        dropdown;
        dropdownContent;
        dropdownItems;
        position;

        constructor(id, title, icon = null, dropdown = false, position = TABBAR_POSITION_START) {
                // string id: id for this tab - used to identify this tab (should be unique)
                // string title: title that is displayed inside tab
                // string icon: FontAwesome icon name that is displayed next to the title
                // array dropdown: array of dropdown items(object) - tag, content, attributes
                this.id = id;
                this.title = title;
                this.icon = icon;
                this.dropdown = dropdown;
                this.position = position;

                if (this.dropdown === true) {
                        this.dropdownItems = [];
                }

                // create wrapper element
                this.html = new HtmlElement('div', null, {class: 'tabbar_tab ' + this.position, id: this.id});
                
                let iconElement = null;
                if (this.icon !== null) {
                        iconElement = new HtmlElement('i', null, {class: 'fa fa-' + this.icon});
                }

                if (this.dropdown === true) {
                        this.html.classList.add('dropdown');

                        // create dropdown button
                        let button = new HtmlElement('div', null, {class: 'dropdown_button row'});
                        button.addEventListener('click', function(e) {
                                let dropdown = e.target.closest('.dropdown');
                                dropdown.classList.toggle('open');
                        });

                        let buttonLabel = new HtmlElement('div', this.title, {class: 'title'});

                        if (iconElement !== null) {
                                // add icon if defined
                                button.appendChild(iconElement);
                        }

                        button.appendChild(buttonLabel);

                        this.html.appendChild(button);

                        // create dropdown content wrapper
                        let content = new HtmlElement('div', null, {class: 'dropdown_content'});
                        this.dropdownContent = content;

                        this.html.appendChild(content);
                } else {
                        this.html.classList.add('row');

                        // add simple text element with icon
                        let title = new HtmlElement('div', this.title, {class: 'title'});
                        
                        if (iconElement !== null) {
                                this.html.appendChild(iconElement);
                        }

                        this.html.appendChild(title);
                }
        }

        addDropdownItem(element) {
                let dropdownItem = element;
                dropdownItem.classList.add('dropdown_content_item');

                this.dropdownItems.push(dropdownItem);
                
                this.dropdownContent.appendChild(dropdownItem);
        }
}