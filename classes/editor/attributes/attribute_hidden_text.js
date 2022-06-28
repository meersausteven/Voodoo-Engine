
class AttributeHiddenText extends AttributeText {
        constructor(name, value) {
                // string name: name of this attribute
                // string value: value of this attribute
                
                super(name, value);
        }
        
        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute', 'hidden_text');
                
                let title = document.createElement('div');
                title.innerHTML = this.value;
                title.addEventListener('click', function(e) {
                        let currentValue = e.target.innerHTML;

                        // create new text input field
                        let input = document.createElement('input');
                        input.setAttribute("type", "text");
                        input.value = currentValue;
                
                        input.addEventListener('keyup', function(e) {
                                this.eventCall(e);
                        }.bind(this));
                        input.addEventListener('change', function(e) {
                                this.eventCall(e);
                        }.bind(this));
                        // replace this input field with a simple text node when pressing enter
                        input.addEventListener('keydown', function(e) {
                                if (e.key === 'Enter') {
                                        let newValue = e.target.value;
                                        if (e.target.value !== '') {
                                                title.innerHTML = e.target.value;

                                                if (this.validate(newValue)) {
                                                        this.change(newValue);
                                                }
                                        }
                        
                                        title.innerHTML = e.target.value;
                                        e.target.parentElement.replaceChild(title, e.target);
                                }
                        }.bind(this));

                        // replace this element with the new input element
                        e.target.parentElement.replaceChild(input, e.target);
                }.bind(this));

                wrapper.appendChild(title);
                
                return wrapper;
        }
}