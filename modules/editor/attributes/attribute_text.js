
export class AttributeText {
        type = 'Attribute Text';
        
        name;
        value;
        startValue;

        /*
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, event = null) {
                this.name = name;
                this.value = value;
                this.event = event;
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
                
                if (newValue == '') {
                        newValue = this.startValue;
                        event.target.value = newValue;console.log(newValue);
                }

                if (this.validate(newValue)) {
                        this.change(newValue);

                        if (this.event !== null) {
                                document.dispatchEvent(new Event(this.event));
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