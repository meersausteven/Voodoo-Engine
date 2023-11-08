
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeColor extends AttributeText {
        type = 'Attribute Color';
        
        /*
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, event) {
                super(name, value, event);
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                if (newValue.match(/^#[a-fA-F0-9]{6}$/)) {
                        return true;
                }

                return false;
        }

        // called when the value changes
        eventCall(event) {
                const newValue = event.target.value;

                if (this.validate(newValue)) {
                        this.change(newValue);
                }
        }

        // generates the HTML element for the editor
        createWidget() {
                const wrapper = new HtmlElement('div', null, {class: 'attribute color'});

                const label = new HtmlElement('label', this.name);

                wrapper.appendChild(label);
                wrapper.appendChild(this.createWidgetInput());

                return wrapper;
        }

        // generates the HTML element for the input
        createWidgetInput() {
                const input = new HtmlElement('input', null, {
                        type: 'color',
                        value: this.value
                });
                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                return input;
        }
}