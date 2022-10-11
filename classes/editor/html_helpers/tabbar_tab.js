
class TabbarTab {
        html;
        title;
        dropdown;
        position;

        constructor(id, title, icon = null, dropdown = null, position = TABBAR_POSITION_START) {
                // string id: id for this tab - used to identify this tab (should be unique)
                // string title: title that is displayed inside tab
                // string icon: FontAwesome icon name that is displayed next to the title
                // array dropdown: array of dropdown items(object) - tag, content, attributes
                this.id = id;
                this.title = title;
                this.icon = icon;
                this.dropdown = dropdown;
                this.position = position;

                // create wrapper element
                this.html = new HtmlElement('div', null, {class: 'tabbar_tab ' + this.position, id: this.id});
                
                let iconElement = null;
                if (this.icon !== null) {
                        iconElement = new HtmlElement('i', null, {class: 'fa fa-' + this.icon});
                }

                if (this.dropdown !== null) {
                        this.html.classList.add('dropdown');

                        // create dropdown button
                        let button = new HtmlElement('div', null, {class: 'dropdown_button row'});

                        let buttonLabel = new HtmlElement('div', this.title, {class: 'title'});

                        if (iconElement !== null) {
                                // add icon if defined
                                button.html.appendChild(iconElement);
                        }

                        button.html.appendChild(buttonLabel);

                        this.html.appendChild(button);

                        // create dropdown content wrapper
                        let content = new HtmlElement('div', null, {class: 'dropdown_content'});

                        // add dropdown elements
                        let i = 0;
                        let l = dropdown.length;
                        while (i < l) {
                                content.html.appendChild(this.addDropdownItem(dropdown[i]));

                                ++i;
                        }

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

        addDropdownItem(item) {
                let dropdownItem = new HtmlElement(item.tag, item.content, item.attributes);

                this.dropdownItems.push(dropdownItem);
                
                return dropdownItem.html;
        }
}