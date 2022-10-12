
import { AttributeText } from './attribute_text.js';

export class AttributeNumber extends AttributeText {
        constructor(name, value, range = null) {
                // string name: name of this attribute
                // int value: value of this attribute
                // Range range: min, max and step of this value's range
                
                super(name, value);

                this.range = range;
        }

        validate(newValue) {
                if (!isNaN(newValue)) {
                        return true;
                }

                return false;
        }

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

        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute');
                
                let label = document.createElement('label');
                label.innerHTML = this.name;

                let input = document.createElement('input');
                if (this.range === null) {
                        input.setAttribute("type", "text");
                        input.value = this.value;
                } else {
                        input.setAttribute("type", "number");
                        input.setAttribute("min", this.range.min);
                        input.setAttribute("max", this.range.max);
                        input.setAttribute("step", this.range.step);
                        input.value = this.value;
                }

                input.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));

                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                
                return wrapper;
        }
}