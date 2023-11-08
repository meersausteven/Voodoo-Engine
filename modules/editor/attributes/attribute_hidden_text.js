
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

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

        // todo: check if this can be made simpler
        createWidget() {
                const wrapper = new HtmlElement('div', null, {class: 'attribute hidden_text'});

                const title = new HtmlElement('div', this.value, {class: 'text'});

                const editIcon = new HtmlElement('i', null, {
                        class: 'edit_text fa fa-pen-nib',
                        title: 'Edit'
                });
                editIcon.addEventListener('click', function(e) {
                        const textElement = e.target.parentElement.querySelector('.text');
                        if (textElement === null) {
                                return;
                        }

                        const currentValue = textElement.innerHTML;

                        // create new text input field
                        const input = new HtmlElement('input', null, {
                                type: 'text',
                                title: `Press 'Enter' to confirm changes`,
                                value: currentValue
                        });
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