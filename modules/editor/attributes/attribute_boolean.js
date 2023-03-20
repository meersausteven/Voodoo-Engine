
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeBoolean extends AttributeText {
        type = 'Attribute Boolean';

        // constructor
        // @param string name: name of this attribute
        // @param bool value: value of this attribute
        // @param string event: event name that should be dispatched when the value changed
        constructor(name, value, event = null) {
                super(name, value, event);
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
                let newValue = event.target.checked;

                if (this.validate(newValue)) {
                        this.change(newValue);
                }
        }

        // generates the HTML element for the editor
        createWidget() {
                let wrapper = new HtmlElement('div', null, {class: 'attribute boolean'});

                let label = new HtmlElement('label', this.name);

                let uncheckedBox = new HtmlElement('i', null, {class: 'fa fa-square'});
                let checkedBox = new HtmlElement('i', null, {class: 'fa fa-square-check'});

                wrapper.appendChild(label);
                wrapper.appendChild(this.createWidgetInput());
                wrapper.appendChild(uncheckedBox);
                wrapper.appendChild(checkedBox);

                return wrapper;
        }

        // generates the HTML element for the input
        createWidgetInput() {
                let input = new HtmlElement('input', null, {
                        type: 'checkbox',
                        title: this.name
                });
                input.checked = this.value;
                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                return input;
        }
}