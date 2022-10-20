
import { AttributeText } from './attribute_text.js';

export class AttributeImage extends AttributeText {
        type = 'Attribute Image';
        
        constructor(name, value) {
                // string name: name of this attribute
                // string value: value of this attribute in form of a path
                
                super(name, value);
        }

        validate(newValue) {
                if (typeof newValue === 'string') {
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
                wrapper.classList.add('attribute', 'image');
                
                let label = document.createElement('label');
                label.innerHTML = this.name;

                let input = document.createElement('input');
                input.setAttribute("type", "text");
                input.value = this.value;

                input.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                let image = document.createElement('img');
                input.src = this.value;

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                wrapper.appendChild(image);
                
                return wrapper;
        }
}