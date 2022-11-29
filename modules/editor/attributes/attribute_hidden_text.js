
import { AttributeText } from './attribute_text.js';

export class AttributeHiddenText extends AttributeText {
        type = 'Attribute Hidden Text';
        
        /*
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, event = null) {
                super(name, value, event);
        }
        
        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute', 'hidden_text');
                
                let title = document.createElement('div');
                title.classList.add('text');
                title.innerHTML = this.value;

                let editIcon = document.createElement('i');
                editIcon.classList.add('edit_text', 'fa', 'fa-pen-nib');
                editIcon.title = 'Edit';

                editIcon.addEventListener('click', function(e) {
                        let textElement = e.target.parentElement.querySelector('.text');
                        if (textElement === null) {
                                return;
                        }

                        let currentValue = textElement.innerHTML;

                        // create new text input field
                        let input = document.createElement('input');
                        input.setAttribute("type", "text");
                        input.title = `'Enter' to confirm changes`;
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

                                        if ((e.target.value === '') ||
                                            (e.target.value.replace(/\s/g, '') === ''))
                                        {
                                                newValue = this.startValue;
                                        }

                                        title.innerHTML = newValue;
                                        if (this.validate(newValue)) {
                                                this.change(newValue);
                                        }
                                        
                                        this.eventCall(e);
                                        
                                        e.target.parentElement.replaceChild(title, e.target);
                                }
                        }.bind(this));

                        // replace this element with the new input element
                        e.target.parentElement.replaceChild(input, textElement);
                        input.focus();
                }.bind(this));

                wrapper.appendChild(title);
                wrapper.appendChild(editIcon);
                
                return wrapper;
        }
}