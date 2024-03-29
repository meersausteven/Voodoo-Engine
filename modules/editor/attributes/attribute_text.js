
import { HtmlElement } from './../html_helpers/html_element.js';

export class AttributeText {
        type = 'Attribute Text';

        /*
         * constructor
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, event = null) {
                this.name = name;
                this.value = value;
                this.event = event;
                this.startValue = value;
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                return typeof newValue === "string";
        }

        // called when the value changes
        eventCall(event) {
                let newValue = event.target.value;

                if (newValue == '') {
                        newValue = this.startValue;
                        event.target.value = newValue;
                }

                if (this.validate(newValue)) {
                        this.change(newValue);

                        if (this.event !== null) {
                                document.dispatchEvent(new Event(this.event));
                        }
                }
        }

        // called after validation was successful to update the object value
        change(newValue) {
                this.value = newValue;
        }

        // generates the HTML element for the editor
        createWidget() {
                const wrapper = new HtmlElement('div', null, {class: 'attribute'});

                const label = new HtmlElement('label', this.name);

                wrapper.appendChild(label);
                wrapper.appendChild(this.createWidgetInput());

                return wrapper;
        }

        // generates the HTML element for the input
        createWidgetInput() {
                const input = new HtmlElement('input', null, {
                        type: 'text',
                        value: this.value
                });
                input.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));
                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                return input;
        }
}