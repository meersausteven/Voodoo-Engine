
import { Vector2 } from '../../collection/vector2.js';

import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeVector2 extends AttributeText {
        type = 'Attribute Vector2';

        /*
         * @param string name: name of the attribute
         * @param Number value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, callback, xLabel = "X", yLabel = "Y", event = null) {
                super(name, value, callback, event);

                this.xLabel = xLabel;
                this.yLabel = yLabel;
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                if (!isNaN(newValue.x) &&
                    !isNaN(newValue.y)) {
                        return true;
                }

                return false;
        }

        // called when the value changes
        eventCall(event) {
                const parent = event.target.parentElement;
                let newValue = event.target.value;

                if ((event.type == 'change') &&
                    (newValue == '')) {
                        if (parent.classList.contains('x')) {
                                newValue = this.startValue.x;
                                event.target.value = newValue;
                        } else if (parent.classList.contains('y')) {
                                newValue = this.startValue.y;
                                event.target.value = newValue;
                        }
                }

                if (!isNaN(newValue)) {
                        newValue = Number(newValue);

                        if (parent.classList.contains('x')) {
                                // offset x changed
                                this.change(new Vector2(newValue, this.value.y));
                        } else if (parent.classList.contains('y')) {
                                // offset y changed
                                this.change(new Vector2(this.value.x, newValue));
                        } else {
                                return false;
                        }
                }
        }

        // called after validation was successful to update the object value
        change(newValueX = null, newValueY = null) {
                let newValue = new Vector2(newValueX, newValueY);
                if (newValueX == null) {
                        newValue = new Vector2(this.value.x, newValueY);
                }
                if (newValueY == null) {
                        newValue = new Vector2(newValueX, this.value.y);
                }

                this.callback(newValue);
                this.value = newValue;

                document.querySelector(`#enchantments .content .item .x input[name="${this.name}"]`).value = this.value.x;
                document.querySelector(`#enchantments .content .item .y input[name="${this.name}"]`).value = this.value.y;
        }

        // returns the value to its start value
        reset() {
                this.change(this.startValue.x, this.startValue.y);
        }

        // generates the HTML element for the editor
        createWidget() {
                const property = new HtmlElement('div', null, {class: 'property'});

                // label
                const propertyLabel = new HtmlElement('div', this.name, {class: 'label'});
                property.appendChild(propertyLabel);

                // input
                const propertyValue = new HtmlElement('div', null, {class: 'value'});

                // x
                const xValue = new HtmlElement('div', null, {class: 'x', id: this.xLabel.toLowerCase()});
                const xLabel = new HtmlElement('label', this.xLabel);

                const xInput = new HtmlElement('input', null, {
                        type: 'text',
                        value: this.value['x'],
                        name: this.name
                });
                xInput.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));
                xInput.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));
                xInput.addEventListener('wheel', function(e) {
                        e.preventDefault();

                        // determine "direction" of scrolling
                        const w = Math.clamp(e.deltaY, -1, 1);

                        // change value
                        this.value['x'] += w * -1;
                        e.target.value = this.value['x'];
                }.bind(this));

                xLabel.appendChild(xInput);
                xValue.appendChild(xLabel);

                propertyValue.appendChild(xValue);

                // y
                const yValue = new HtmlElement('div', null, {class: 'y', id: this.yLabel.toLowerCase()});
                const yLabel = new HtmlElement('label', this.yLabel);

                const yInput = new HtmlElement('input', null, {
                        type: 'text',
                        value: this.value['y'],
                        name: this.name
                });
                yInput.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));
                yInput.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));
                yInput.addEventListener('wheel', function(e) {
                        e.preventDefault();

                        // determine "direction" of scrolling
                        const w = Math.clamp(e.deltaY, -1, 1);

                        // change value
                        this.value['y'] += w * -1;
                        e.target.value = this.value['y'];
                }.bind(this));

                yLabel.appendChild(yInput);
                yValue.appendChild(yLabel);

                propertyValue.appendChild(yValue);

                property.appendChild(propertyValue);

                return property;
        }
}