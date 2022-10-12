
import { AttributeText } from './attribute_text.js';

export class AttributeColor extends AttributeText {
        constructor(name, value) {
                // string name: name of this attribute
                // boolean value: value of this attribute
                
                super(name, value);
        }

        validate(newValue) {
                if (newValue.match(/^#[a-fA-F0-9]{6}$/)) {
                        return true;
                }

                return false;
        }

        eventCall(event) {
                let newValue = event.target.value;
                if (this.validate(newValue)) {
                        this.change(newValue);
                }
        }

        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute', 'color');
                
                let label = document.createElement('label');
                label.innerHTML = this.name;

                let input = document.createElement('input');
                input.setAttribute("type", "color");
                input.value = this.value;

                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                
                return wrapper;
        }
}