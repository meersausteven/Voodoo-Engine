
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeNumber extends AttributeText {
        type = 'Attribute Number';

        // called to check whether the new value is of the correct type
        validate(newValue) {
                return !isNaN(newValue);
        }

        // called when the value changes
        eventCall(event) {
                let newValue = event.target.value;

                if ((event.type == 'change') &&
                    (newValue == '')) {
                        newValue = this.startValue;
                        event.target.value = newValue;
                }

                if (this.validate(newValue)) {
                        this.change(Number(newValue));
                }
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
                        type: 'text',
                        value: this.value,
                        name: this.name
                });
                input.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));
                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));
                input.addEventListener('wheel', function(e) {
                        e.preventDefault();

                        // determine "direction" of scrolling
                        const w = Math.clamp(e.deltaY, -1, 1);

                        // change value and clamp if necessary
                        this.value += w * -1;

                        // update value in input
                        e.target.value = this.value;
                }.bind(this));

                label.appendChild(input);
                propertyValue.appendChild(label);

                property.appendChild(propertyValue);

                return property;
        }
}