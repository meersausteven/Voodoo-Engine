
import { AttributeArrayText } from './attribute_array_text.js';

import { HtmlElement } from '../html_helpers/html_element.js';

import { Vector2 } from '../../collection/vector2.js';

export class AttributeArrayVector2 extends AttributeArrayText {
        type = 'Attribute Array Vector2';
        widgetType = 'vector2';

        /*
         * constructor
         * @param string name: name of the attribute
         * @param array value: array of values
         * @param string event: event name that should be dispatched when the value changed
         */
        constructor(name, value = [], event = null) {
                super(name, value, event);

                this.prototype = Vector2.prototype;
        }

        // called when the value changes
        eventCall(event, index) {
                let parent = event.target.parentElement;
                let newValue = event.target.value;

                if ((event.type == 'change') &&
                    (newValue == '')) {
                        if (parent.classList[0].includes('x')) {
                                newValue = this.startValue[index].x;
                                event.target.value = newValue;
                        } else if (parent.classList[0].includes('y')) {
                                newValue = this.startValue[index].y;
                                event.target.value = newValue;
                        }
                }

                if (!isNaN(newValue)) {
                        newValue = Number(newValue);

                        if (parent.classList[0].includes('x')) {
                                // offset x changed
                                this.value[index] = (new Vector2(newValue, this.value.y));
                        } else if (parent.classList[0].includes('y')) {
                                // offset y changed
                                this.value[index] = (new Vector2(this.value.x, newValue));
                        } else {
                                return false;
                        }
                }
        }

        // generates the HTML element for the editor
        createWidget() {
                let wrapper = new HtmlElement('div', null, {class: 'attribute array'});

                let foldout = new HtmlElement('div', null, {class: 'foldout open'});

                // title
                let foldoutTitle = new HtmlElement('div', null, {class: 'foldout_title'});

                let label = new HtmlElement('label', this.name);
                let iconDown = new HtmlElement('i', null, {class: 'fa fa-caret-down'});
                let iconLeft = new HtmlElement('i', null, {class: 'fa fa-caret-left'});

                foldoutTitle.appendChild(label);
                foldoutTitle.appendChild(iconDown);
                foldoutTitle.appendChild(iconLeft);

                // content
                let foldoutContent = new HtmlElement('div', null, {class: 'foldout_content'});

                // array items
                let i = 0;
                let l = this.value.length;
                while(i < l) {
                        foldoutContent.appendChild(this.createNewItem(i));

                        ++i;
                }

                foldout.appendChild(foldoutTitle);
                foldout.appendChild(foldoutContent);

                // add new item button
                let addItemButton = new HtmlElement('div', null, {class: 'button_link'});
                addItemButton.addEventListener('click', function() {
                        // add new item to array
                        let newItemsLength = this.value.push(null);

                        // create html for new item in editor
                        let newItemHtml = this.createNewItem(newItemsLength - 1);
                        foldoutContent.appendChild(newItemHtml);

                        newItemHtml.querySelector('input').focus();
                }.bind(this));

                let addItemIcon = new HtmlElement('i', null, {class: 'fa fa-square-plus'});
                let addItemText = new HtmlElement('span', 'Add Item');

                addItemButton.appendChild(addItemIcon);
                addItemButton.appendChild(addItemText);

                foldout.appendChild(addItemButton);

                wrapper.appendChild(foldout);

                return wrapper;
        }

        // create new array element and html input fields according to the specified type
        // vector2 needs 2 input fields
        createNewItem(index) {
                let itemValue = this.value[index];

                let wrapper = new HtmlElement('div', null, {class: 'attribute_array_item ' + this.widgetType});

                // input field
                wrapper.appendChild(this.createNewItemInput(itemValue.x, index, 'x'));
                wrapper.appendChild(this.createNewItemInput(itemValue.y, index, 'y'));

                // remove item button
                let removeButton = new HtmlElement('div', null, {class: 'button_link'});
                removeButton.addEventListener('click', function() {
                        this.value.splice(index, 1);
                        wrapper.remove();
                }.bind(this));

                let removeIcon = new HtmlElement('i', null, {
                        class: 'fa fa-delete-left',
                        title: 'Remove this item'
                });

                removeButton.appendChild(removeIcon);

                wrapper.appendChild(removeButton);

                return wrapper;
        }

        createNewItemInput(itemValue, index, value) {
                let inputWrapper = new HtmlElement('div', null, {class: value});

                let label = new HtmlElement('label', value.toUpperCase());

                let input = new HtmlElement('input', null, {
                        type: 'text',
                        value: itemValue
                });
                input.addEventListener('keyup', function(e) {
                        this.eventCall(e, index);
                }.bind(this));
                input.addEventListener('change', function(e) {
                        this.eventCall(e, index);
                }.bind(this));

                inputWrapper.appendChild(label);
                inputWrapper.appendChild(input);

                return inputWrapper;
        }
}