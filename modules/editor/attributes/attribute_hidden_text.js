
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeHiddenText extends AttributeText {
        type = 'Attribute Hidden Text';

        /*
         * @param string name: name of the attribute
         * @param string value: value of the attribute
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value, callback, event = null) {
                super(name, value, callback, event);
        }

        // called after validation was successful to update the object value
        change(newValue) {
                this.callback(newValue);
                this.value = newValue;
        }

        createWidget() {
                const text = new HtmlElement('div', this.value, {class: 'text'});

                text.addEventListener('dblclick', function(e) {
                        // create new text input field
                        const tempInput = new HtmlElement('input', null, {
                                type: 'text',
                                title: "Press 'Enter' to confirm changes",
                                value: this.value
                        });
                        tempInput.addEventListener('keyup', function(e) {
                                this.eventCall(e);
                        }.bind(this));
                        tempInput.addEventListener('change', function(e) {
                                this.eventCall(e);
                        }.bind(this));

                        // replace input element with normal text node when pressing 'enter'
                        tempInput.addEventListener('keydown', function(e) {
                                if (e.key === 'Enter') {
                                        let newValue = e.target.value;

                                        if ((e.target.value === '') ||
                                            (e.target.value.replace(/\s/g, '') === ''))
                                        {
                                                newValue = this.startValue;
                                        }

                                        text.innerHTML = newValue;
                                        if (this.validate(newValue)) {
                                                this.change(newValue);
                                        }

                                        this.eventCall(e);

                                        e.target.parentElement.replaceChild(text, e.target);
                                }
                        }.bind(this));
                        // replace input element with normal text node when unfocusing the input
                        tempInput.addEventListener('focusout', function(e) {
                                let newValue = e.target.value;

                                if ((e.target.value === '') ||
                                    (e.target.value.replace(/\s/g, '') === ''))
                                {
                                        newValue = this.startValue;
                                }

                                text.innerHTML = newValue;
                                if (this.validate(newValue)) {
                                        this.change(newValue);
                                }

                                this.eventCall(e);

                                e.target.parentElement.replaceChild(text, e.target);
                        }.bind(this));

                        // replace normal text with new input element
                        e.target.parentElement.replaceChild(tempInput, text);
                        tempInput.focus();
                }.bind(this));

                return text;
        }
}