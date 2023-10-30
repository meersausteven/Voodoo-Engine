
import { Vector2 } from './../collection/vector2.js';
import { Range } from './../collection/range.js';

import { AttributeText } from './../editor/attributes/attribute_text.js';
import { AttributeVector2 } from './../editor/attributes/attribute_vector2.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';

import { Component } from './component.js';

import { HtmlElement } from './../editor/html_helpers/html_element.js';

export class Transform extends Component {
        type = "Transform";

        /*
         * constructor
         * @param Vector2 position: position of the gameObject
         * @param number rotation: rotation of the gameObject
         * @param Vector2 scale: scale of the gameObject
         */
        constructor(position = new Vector2(), rotation = 0, scale = new Vector2(1, 1)) {
                super();

                this.attributes['position'] = new AttributeVector2('Position', position);
                this.attributes['rotation'] = new AttributeNumber('Rotation', rotation, null, new Range(-Number.MAX_VALUE));
                this.attributes['scale'] = new AttributeVector2('Scale', scale);
        }

        renderGizmo(camera) {
                camera.canvasContext.save();

                camera.canvasContext.translate(this.attributes['position'].value.x - camera.worldPos.x, this.attributes['position'].value.y - camera.worldPos.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.attributes['rotation'].value));

                const spritePath = this.gameObject.scene.project.settings.filePathSprites;
                // up arrow
                const upArrow = new Image(18, 100);
                upArrow.src = spritePath + 'editor/widgets/transform_up_arrow.png';
                camera.canvasContext.drawImage(upArrow, -9, -100, 18, 100);
                // right arrow
                const rightArrow = new Image(100, 18);
                rightArrow.src = spritePath + 'editor/widgets/transform_right_arrow.png';
                camera.canvasContext.drawImage(rightArrow, 0, -9, 100, 18);
                // center box
                const centerBox = new Image(18, 18);
                centerBox.src = spritePath + 'editor/widgets/transform_center.png';
                camera.canvasContext.drawImage(centerBox, -9, -9, 18, 18);

                camera.canvasContext.restore();
        }

        // create HTML element for the editor
        createEditorCard() {
                const wrapper = new HtmlElement('div', null, {class: 'component'});
                wrapper.classList.add('open');

                const title = this.editorCardTitle();
                const content = this.editorCardContent();

                wrapper.appendChild(title);
                wrapper.appendChild(content);

                return wrapper;
        }

        // create HTML for the title in the editor card
        editorCardTitle() {
                const title = new HtmlElement('div', null, {class: 'title'});

                // collapse component
                const collapse = new HtmlElement('div', null, {class: 'collapse', title: 'Collapse/Expand this component'});
                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                const collapseIcon = new HtmlElement('i', null, {class: 'fa fa-angle-down'});
                collapse.appendChild(collapseIcon);

                title.appendChild(collapse);

                // component name
                const titleContent = new HtmlElement('div', this.type, {class: 'component_name'});
                title.appendChild(titleContent);

                return title;
        }
}