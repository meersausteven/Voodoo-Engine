
export class AttributeText {
        type = 'Attribute Text';
        
        name;
        value;
        startValue;

        constructor(name, value) {
                // string name: name of this attribute
                // string value: value of this attribute
                
                this.name = name;
                this.value = value;
                this.startValue = value;
        }

        validate(newValue) {
                if (typeof newValue === "string") {
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
                        this.change(newValue);

                        if (event.type == 'change') {
                                event.target.dispatchEvent(new Event('value_changed'));
                        }
                }
        }

        change(newValue) {
                this.value = newValue;
        }

        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute');
                
                let label = document.createElement('label');
                label.innerHTML = this.name;

                let input = document.createElement('input');
                input.setAttribute("type", "text");
                input.value = this.value;
                
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