
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeBoolean extends AttributeText {
        type = 'Attribute Boolean';

        // constructor
        // @param string name: name of this attribute
        // @param bool value: value of this attribute
        // @param string event: event name that should be dispatched when the value changed
        constructor(name, value, callback, event = null) {
                super(name, value, callback, event);
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                if (typeof newValue === "boolean") {
                        this.change(newValue);

                        return true;
                }

                return false;
        }

        // called when the value changes
        eventCall(event) {
                const newValue = event.target.checked;

                if (this.validate(newValue)) {
                        this.change(newValue);
                }
        }

        // called after validation was successful to update the object value
        change(newValue) {
                this.callback(newValue);
                this.value = newValue;

                document.querySelector(`#enchantments .content .item input[name="${this.name}"]`).checked = this.value;
        }

        // generates the HTML element for the editor
        createWidget() {
                const property = new HtmlElement('div', null, {class: 'property'});

                // label
                const propertyLabel = new HtmlElement('div', this.name, {class: 'label'});
                property.appendChild(propertyLabel);

                // input
                const propertyValue = new HtmlElement('div', null, {class: 'value'});
                const label = new HtmlElement('label', null);

                const input = new HtmlElement('input', null, {
                        type: 'checkbox',
                        title: this.name,
                        name: this.name
                });
                input.checked = this.value;
                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                label.appendChild(input);

                const toggleSwitch = new HtmlElement('div', null, {class: 'toggle'});
                label.appendChild(toggleSwitch);

                propertyValue.appendChild(label);

                property.appendChild(propertyValue);

                return property;
        }
}