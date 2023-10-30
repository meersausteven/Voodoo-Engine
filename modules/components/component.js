
import { AttributeText } from './../editor/attributes/attribute_text.js';
import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';

import { HtmlElement } from './../editor/html_helpers/html_element.js';

export class Component {
        type = "Component";
        gameObject = null;
        attributes = {};

        constructor() {
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
        }

        // called when initializing
        start() {
                return;
        }

        // called every frame
        update() {
                return;
        }

        // called in a certain interval
        fixedUpdate() {
                return;
        }

        // called after the update method
        lateUpdate() {
                return;
        }

        renderGizmo(camera) {
                return;
        }

        // create HTML element for the editor
        createEditorCard(additionalContent = null) {
                const wrapper = new HtmlElement('div', null, {class: 'component ' + this.type.toLowerCase().replace(" ", "_")});

                const title = this.editorCardTitle();
                const content = this.editorCardContent();
                if (additionalContent !== null) {
                        content.appendChild(additionalContent);
                }

                wrapper.appendChild(title);
                wrapper.appendChild(content);

                return wrapper;
        }

        // create HTML for the title in the editor card
        editorCardTitle() {
                let title = new HtmlElement('div', null, {class: 'title'});

                // collapse component
                let collapse = new HtmlElement('div', null, {class: 'collapse', title: 'Collapse/Expand this component'});
                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                let collapseIcon = new HtmlElement('i', null, {class: 'fa fa-angle-down'});
                collapse.appendChild(collapseIcon);

                title.appendChild(collapse);

                // component name
                let titleContent = new HtmlElement('div', this.type, {class: 'component_name'});
                title.appendChild(titleContent);

                // component settings dropdown menu
                let dropdown = new HtmlElement('div', null, {class: 'dropdown'});

                let dropdownButton = new HtmlElement('div', null, {class: 'dropdown_button', title: 'Component settings'});

                let icon = new HtmlElement('i', null, {class: 'fa fa-gear'});
                dropdownButton.appendChild(icon);

                dropdown.appendChild(dropdownButton);

                let dropdownContent = new HtmlElement('div', null, {class: 'dropdown_content'});

                // enable / disable component widget
                let enableComponent = this.attributes['enabled'].createWidget();
                enableComponent.classList.add('dropdown_content_item');
                dropdownContent.appendChild(enableComponent);

                // remove component button
                // todo: fix removal for renderer components - still needs to be removed from the renderer buffer
                let removeComponent = new HtmlElement('div', null, {class: 'remove_component dropdown_content_item', title: 'Remove this component'});
                removeComponent.addEventListener('click', function() {
                        this.gameObject.removeComponent(this);
                        wrapper.remove();
                }.bind(this));

                let removeText = new HtmlElement('span', 'Remove Component');
                removeComponent.appendChild(removeText);

                let removeIcon = new HtmlElement('i', null, {class: 'fa fa-xmark'});
                removeComponent.appendChild(removeIcon);

                dropdownContent.appendChild(removeComponent);

                dropdown.appendChild(dropdownContent);

                title.appendChild(dropdown);

                return title;
        }

        // create HTML for the content in the editor card
        editorCardContent() {
                const content = new HtmlElement('div', null, {class: 'content'});

                for (let key in this.attributes) {
                        if (key !== 'enabled') {
                                // skip 'enabled' attribute because we already added it in the settings dropdown

                                if (this.attributes[key] instanceof AttributeText) {
                                        content.appendChild(this.attributes[key].createWidget());
                                }
                        }
                }

                return content;
        }
}