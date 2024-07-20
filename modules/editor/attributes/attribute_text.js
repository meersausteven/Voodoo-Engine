
import { HtmlElement } from './../html_helpers/html_element.js';

export class AttributeText {
        type = 'Attribute Text';

        /*
         * constructor
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, callback, event = null) {
                this.name = name;
                this.value = value;
                this.callback = callback;
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
                this.callback(newValue);
                this.value = newValue;

                document.querySelector(`#enchantments .content .item input[name="${this.name}"]`).value = this.value;
        }

        // returns the value to its start value
        reset() {
                this.change(this.startValue);
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

                label.appendChild(input);
                propertyValue.appendChild(label);

                property.appendChild(propertyValue);

                return property;
        }
}