
import { AttributeText } from './attribute_text.js';

export class AttributeBoolean extends AttributeText {
        constructor(name, value) {
                // string name: name of this attribute
                // boolean value: value of this attribute
                
                super(name, value);
        }

        validate(newValue) {
                if (typeof newValue === "boolean") {
                        this.change(newValue);

                        return true;
                }

                return false;
        }

        eventCall(event) {
                let newValue = event.target.checked;

                if (this.validate(newValue)) {
                        this.change(newValue);
                }
        }

        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute', 'boolean');
                
                let label = document.createElement('label');
                label.innerHTML = this.name;

                let input = document.createElement('input');
                input.setAttribute("type", "checkbox");
                input.title = this.name;
                input.checked = this.value;

                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                
                return wrapper;
        }
}