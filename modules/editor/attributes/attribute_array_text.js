
import { AttributeText } from './attribute_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

export class AttributeArrayText extends AttributeText {
        type = 'Attribute Array Text';
        widgetType = 'text';

        /*
         * constructor
         * @param string name: name of the attribute
         * @param string[] value: array of values
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value = [], event = null) {
                super(name, value, event);

                this.prototype = String.prototype;
        }

        // called to check whether the new value is of the correct type
        validate(newValue) {
                return Object.getPrototypeOf(newValue) === this.prototype;
        }

        // called when the value changes
        eventCall(event, index) {
                let newValue = event.target.value;

                if (newValue == '') {
                        newValue = this.startValue[index];
                        event.target.value = newValue;
                }

                if (this.validate(newValue)) {
                        this.value[index] = newValue;

                        if (this.event !== null) {
                                document.dispatchEvent(new Event(this.event));
                        }
                }
        }

        // generates the HTML element for the editor
        createWidget() {
                const wrapper = new HtmlElement('div', null, {class: 'attribute array'});

                const foldout = new HtmlElement('div', null, {class: 'foldout open'});

                // title
                const foldoutTitle = new HtmlElement('div', null, {class: 'foldout_title'});

                const label = new HtmlElement('label', this.name);
                const iconDown = new HtmlElement('i', null, {class: 'fa fa-caret-down'});
                const iconLeft = new HtmlElement('i', null, {class: 'fa fa-caret-left'});

                foldoutTitle.appendChild(label);
                foldoutTitle.appendChild(iconDown);
                foldoutTitle.appendChild(iconLeft);

                // content
                const foldoutContent = new HtmlElement('div', null, {class: 'foldout_content'});

                // array items
                let i = 0;
                const l = this.value.length;
                while(i < l) {
                        foldoutContent.appendChild(this.createNewItem(i));

                        ++i;
                }

                foldout.appendChild(foldoutTitle);
                foldout.appendChild(foldoutContent);

                // add new item button
                const addItemButton = new HtmlElement('div', null, {class: 'button_link'});
                addItemButton.addEventListener('click', function() {
                        // add new item to array
                        const newItemsLength = this.value.push(null);

                        // create html for new item in editor
                        const newItemHtml = this.createNewItem(newItemsLength - 1);
                        foldoutContent.appendChild(newItemHtml);

                        newItemHtml.querySelector('input').focus();
                }.bind(this));

                const addItemIcon = new HtmlElement('i', null, {class: 'fa fa-square-plus'});
                const addItemText = new HtmlElement('span', 'Add Item');

                addItemButton.appendChild(addItemIcon);
                addItemButton.appendChild(addItemText);

                foldout.appendChild(addItemButton);

                wrapper.appendChild(foldout);

                return wrapper;
        }

        // create new array element and html input fields according to the specified type
        // vector2 needs 2 input fields
        createNewItem(index) {
                const itemValue = this.value[index];

                const wrapper = new HtmlElement('div', null, {class: 'attribute_array_item ' + this.widgetType});

                // input field
                const input = this.createNewItemInput(itemValue, index);

                wrapper.appendChild(input);

                // remove item button
                const removeButton = new HtmlElement('div', null, {class: 'button_link'});
                removeButton.addEventListener('click', function() {
                        this.value.splice(index, 1);
                        wrapper.remove();
                }.bind(this));

                const removeIcon = new HtmlElement('i', null, {
                        class: 'fa fa-trash',
                        title: 'Remove this item'
                });

                removeButton.appendChild(removeIcon);

                wrapper.appendChild(removeButton);

                return wrapper;
        }

        createNewItemInput(itemValue, index) {
                const inputWrapper = new HtmlElement('div', null, {class: 'item_wrapper'});

                const input = new HtmlElement('input', null, {type: 'text', value: itemValue});
                input.addEventListener('keyup', function(e) {
                        this.eventCall(e, index);
                }.bind(this));
                input.addEventListener('change', function(e) {
                        this.eventCall(e, index);
                }.bind(this));

                inputWrapper.appendChild(input);

                return inputWrapper;
        }
}