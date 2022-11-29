
import { AttributeText } from './attribute_text.js';

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