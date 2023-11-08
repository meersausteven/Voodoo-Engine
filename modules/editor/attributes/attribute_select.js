
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
        constructor(name, value, options = [], event = null) {
                super(name, value, event);

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

        // generates the HTML element for the editor
        createWidget() {
                let wrapper = new HtmlElement('div', null, {class: 'attribute select'});

                let label = new HtmlElement('label', this.name);

                wrapper.appendChild(label);
                wrapper.appendChild(this.createWidgetInput());

                return wrapper;
        }

        // generates the HTML element for the input
        createWidgetInput() {
                let select = new HtmlElement('select', null);
                select.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                let i = 0;
                let l = this.options.length;
                while (i < l) {
                        let option = new HtmlElement('option', this.options[i], {value: this.options[i]});
                        if (this.options[i] === this.value) {
                                option.selected = true;
                        }

                        select.appendChild(option);

                        ++i;
                }

                return select;
        }
}