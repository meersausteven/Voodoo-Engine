
import { Vector2 } from '../../collection/vector2.js';

import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeVector2 extends AttributeText {
        type = 'Attribute Vector2';

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
                        if (parent.classList[0].includes('x')) {
                                newValue = this.startValue.x;
                                event.target.value = newValue;
                        } else if (parent.classList[0].includes('y')) {
                                newValue = this.startValue.y;
                                event.target.value = newValue;
                        }
                }

                if (!isNaN(newValue)) {
                        newValue = Number(newValue);

                        if (parent.classList[0].includes('x')) {
                                // offset x changed
                                this.change(new Vector2(newValue, this.value.y));
                        } else if (parent.classList[0].includes('y')) {
                                // offset y changed
                                this.change(new Vector2(this.value.x, newValue));
                        } else {
                                return false;
                        }
                }
        }

        // generates the HTML element for the editor
        createWidget() {
                const wrapper = new HtmlElement('div', null, {class: 'attribute vector2'});

                const title = new HtmlElement('div', this.name, {class: 'title'});

                wrapper.appendChild(title);
                wrapper.appendChild(this.createWidgetInput('x'));
                wrapper.appendChild(this.createWidgetInput('y'));

                return wrapper;
        }

        // generates the HTML element for the input
        createWidgetInput(value) {
                const inputWrapper = new HtmlElement('div', null, {class: value});

                const label = new HtmlElement('label', value.toUpperCase());

                const input = new HtmlElement('input', null, {
                        type: 'text',
                        value: this.value[value]
                });
                input.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));
                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                inputWrapper.appendChild(label);
                inputWrapper.appendChild(input);

                return inputWrapper;
        }
}