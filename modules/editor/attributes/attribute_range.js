
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeRange extends AttributeText {
        type = 'Attribute Range';

        /*
         * @param string name: name of the attribute
         * @param Number value: value of the attribute
         * @param Range range: range with min, max and step size
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, range, valueSuffix = '', decimals = null, event = null) {
                super(name, value, event);

                this.range = range;
                this.valueSuffix = valueSuffix;
                this.decimals = decimals;
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                return !isNaN(newValue);
        }

        // called when the value changes
        eventCall(event) {
                let newValue = event.target.value;

                if (this.validate(newValue)) {
                        newValue = new Number(newValue);

                        // wrap value around if its below min or above max
                        if ((newValue > this.range.max) || (newValue < this.range.min)) {
                                const diff = this.range.max - this.range.min;
                                newValue = ((newValue + this.range.max) % diff + diff) % diff + this.range.min;
                        }

                        this.change(newValue);
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
                        type: 'range',
                        min: this.range.min,
                        max: this.range.max,
                        step: this.range.step,
                        value: this.value,
                        name: this.name
                });

                // enable direct input when double clicking the value
                let textContent = this.value + this.valueSuffix;
                if (this.decimals !== null) {
                        textContent = this.value.toFixed(this.decimals) + this.valueSuffix;
                }

                const text = new HtmlElement('div', textContent, {class: 'text'});
                text.addEventListener('dblclick', function(e) {
                        // create new text input field
                        const tempInput = new HtmlElement('input', null, {
                                type: 'text',
                                title: "Press 'Enter' to confirm changes",
                                value: this.value,
                                class: 'text'
                        });
                        tempInput.addEventListener('keyup', function(e) {
                                this.eventCall(e);
                        }.bind(this));
                        tempInput.addEventListener('change', function(e) {
                                this.eventCall(e);
                        }.bind(this));

                        // replace input element with normal text node when pressing 'enter'
                        tempInput.addEventListener('keydown', function(e) {
                                if (e.key === 'Enter') {
                                        let newValue = e.target.value;

                                        if ((e.target.value === '') ||
                                            (e.target.value.replace(/\s/g, '') === ''))
                                        {
                                                newValue = this.startValue;
                                        }

                                        this.eventCall(e);

                                        if (this.decimals !== null) {
                                                input.value = this.value.toFixed(this.decimals);
                                        } else {
                                                input.value = this.value;
                                        }

                                        text.innerHTML = this.value + this.valueSuffix;

                                        e.target.parentElement.replaceChild(text, e.target);
                                }
                        }.bind(this));
                        // replace input element with normal text node when unfocusing the input
                        tempInput.addEventListener('focusout', function(e) {
                                let newValue = e.target.value;

                                if ((e.target.value === '') ||
                                    (e.target.value.replace(/\s/g, '') === ''))
                                {
                                        newValue = this.startValue;
                                }

                                this.eventCall(e);

                                input.value = this.value;
                                text.innerHTML = this.value + this.valueSuffix;

                                e.target.parentElement.replaceChild(text, e.target);
                        }.bind(this));

                        // replace normal text with new input element
                        e.target.parentElement.replaceChild(tempInput, text);
                        tempInput.focus();
                }.bind(this));

                label.appendChild(text);

                // update text when slider is being moved
                input.addEventListener('input', function(e) {
                        this.eventCall(e);

                        if (this.decimals !== null) {
                                text.innerHTML = this.value.toFixed(this.decimals) + this.valueSuffix;
                        } else {
                                text.innerHTML = this.value + this.valueSuffix;
                        }
                }.bind(this));

                label.appendChild(input);
                propertyValue.appendChild(label);

                property.appendChild(propertyValue);

                return property;
        }
}