
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeNumber extends AttributeText {
        type = 'Attribute Number';

        /*
         * @param string name: name of the attribute
         * @param Number value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         * @param Range range: range with min, max and step size
         */
        constructor(name, value, event = null, range = null) {
                super(name, value, event);

                this.range = range;
        }

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
                        if (this.range !== null) {
                                newValue = Math.clamp(newValue, this.range.min, this.range.max);
                        }

                        this.change(Number(newValue));
                }
        }

        // generates the HTML element for the editor
        createWidget() {
                const wrapper = new HtmlElement('div', null, {class: 'attribute number'});

                const label = new HtmlElement('label', this.name);

                wrapper.appendChild(label);
                wrapper.appendChild(this.createWidgetInput());

                return wrapper;
        }

        // generates the HTML element for the input
        createWidgetInput() {
                const inputWrapper = new HtmlElement('div', null, {class: 'input_wrapper'});

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