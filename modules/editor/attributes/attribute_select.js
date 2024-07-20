
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from './../html_helpers/html_element.js';

export class AttributeSelect extends AttributeText {
        type = 'Attribute Select';

        /*
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string[] options: array of options
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, options = [], callback, event = null) {
                super(name, value, callback, event);

                this.options = options;
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                return this.options.includes(newValue);
        }

        // called when the value changes
        eventCall(event) {
                const newValue = event.target.value;

                if (this.validate(newValue)) {
                        this.change(newValue);
                }
        }

        // called after validation was successful to update the object value
        change(newValue) {
                this.callback(newValue);
                this.value = newValue;

                document.querySelector(`#enchantments .content .item select[name="${this.name}"] option[value="${this.value}"]`).selected = true;
        }

        // generates the HTML element for the editor
        createWidget() {
                const property = new HtmlElement('div', null, {class: 'property'});

                // label
                const propertyLabel = new HtmlElement('div', this.name, {class: 'label'});
                property.appendChild(propertyLabel);

                // select
                const propertyValue = new HtmlElement('div', null, {class: 'value'});
                const label = new HtmlElement('label', null);

                let select = new HtmlElement('select', null, { name: this.name });
                select.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                let i = 0;
                const l = this.options.length;
                while (i < l) {
                        let option = new HtmlElement('option', this.options[i], {value: this.options[i]});
                        if (this.options[i] === this.value) {
                                option.selected = true;
                        }

                        select.appendChild(option);

                        ++i;
                }

                label.appendChild(select);
                propertyValue.appendChild(label);

                property.appendChild(propertyValue);

                return property;
        }
}