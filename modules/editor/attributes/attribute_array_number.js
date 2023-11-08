
import { AttributeArrayText } from './attribute_array_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeArrayNumber extends AttributeArrayText {
        type = 'Attribute Array Number';
        widgetType = 'number';

        /*
         * constructor
         * @param string name: name of the attribute
         * @param array value: array of values
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value = [], event = null, range = null) {
                super(name, value, event);

                this.range = range;
                this.prototype = Number.prototype;
        }

        // called when the value changes
        eventCall(event) {
                let newValue = event.target.value;

                if (newValue == '') {
                        newValue = this.startValue[index];
                        event.target.value = newValue;
                }

                if (this.validate(newValue)) {
                        if (this.range !== null) {
                                newValue = Math.clamp(newValue, this.range.min, this.range.max);
                        }

                        this.value[index] = Number(newValue);

                        if (this.event !== null) {
                                document.dispatchEvent(new Event(this.event));
                        }
                }
        }

        createNewItemInput(itemValue, index) {
                const inputWrapper = new HtmlElement('div', null, {class: 'item_wrapper'});

                const input = new HtmlElement('input', null, {
                        type: 'text',
                        value: itemValue
                });
                input.addEventListener('keyup', function(e) {
                        this.eventCall(e, index);
                }.bind(this));
                input.addEventListener('change', function(e) {
                        this.eventCall(e, index);
                }.bind(this));

                // for range fields add custom buttons and additional attributes
                if (this.range !== null) {
                        input.setAttribute('type', 'number');
                        input.setAttribute('min', this.range.min);
                        input.setAttribute('max', this.range.max);
                        input.setAttribute('step', this.range.step);

                        const stepUpButton = new HtmlElement('button', null, {class: 'step_up'});
                        stepUpButton.addEventListener('click', function(e) {
                                const input = e.target.nextElementSibling;

                                input.stepUp();
                                input.dispatchEvent(new Event('change'));
                        });
                        const stepDownButton = new HtmlElement('button', null, {class: 'step_down'});
                        stepDownButton.addEventListener('click', function(e) {
                                const input = e.target.previousElementSibling;

                                input.stepDown();
                                input.dispatchEvent(new Event('change'));
                        });

                        inputWrapper.appendChild(stepUpButton);
                        inputWrapper.appendChild(input);
                        inputWrapper.appendChild(stepDownButton);
                } else {
                        inputWrapper.appendChild(input);
                }

                return inputWrapper;
        }
}