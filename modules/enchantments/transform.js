
import { Vector2 } from './../collection/vector2.js';
import { Bounds } from './../collection/bounds.js';
import { Gizmo } from  './../editor/gizmo.js';
import { Range } from './../collection/range.js';

import { AttributeText } from './../editor/attributes/attribute_text.js';
import { AttributeVector2 } from './../editor/attributes/attribute_vector2.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';
import { AttributeRange } from './../editor/attributes/attribute_range.js';

import { Enchantment } from './enchantment.js';

import { HtmlElement } from './../editor/html_helpers/html_element.js';

export class Transform extends Enchantment {
        type = "Transform";
        icon = "fa-location-crosshairs";
        gizmos = [];
        parent = null;
        children = [];

        /*
         * constructor
         * @param Vector2 position: position of the talisman
         * @param number rotation: rotation of the talisman
         * @param Vector2 scale: scale of the talisman
         */
        constructor(position = new Vector2(), rotation = 0, scale = new Vector2(1, 1)) {
                super();

                this.position = position;
                this.rotation = rotation;
                this.scale = scale;

                if (Object.keys(this.editorAttributes).legnth > 0) {
                        this.updateGizmoData();
                }

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['position'] = new AttributeVector2('Position', this.position, this.set.bind(this, 'position'));
                this.editorAttributes['rotation'] = new AttributeRange('rotation', this.rotation, new Range(-180, 180), this.set.bind(this, 'rotation'), '°');
                this.editorAttributes['scale'] = new AttributeVector2('Scale', this.scale, this.set.bind(this, 'scale'));
        }

        // update editor gizmo data
        updateGizmoData() {
                this.gizmos = [
                        new Gizmo("upArrow",
                                new Bounds(
                                        this.position.y - 100,
                                        this.position.x + 9,
                                        this.position.y - 9,
                                        this.position.x - 9
                                ),
                                this.editorAttributes['position'],
                                new Vector2(-9, -100),
                                window.location.href + '/../assets/sprites/editor/widgets/transform_up_arrow.png',
                                18,
                                100,
                                Vector2.bottom
                        ),
                        new Gizmo("rightArrow",
                                new Bounds(
                                        this.position.y + -9,
                                        this.position.x + 100,
                                        this.position.y + 9,
                                        this.position.x + 9
                                ),
                                this.editorAttributes['position'],
                                new Vector2(0, -9),
                                window.location.href + '/../assets/sprites/editor/widgets/transform_right_arrow.png',
                                100,
                                18,
                                Vector2.right
                        ),
                        new Gizmo("centerBox",
                                new Bounds(
                                        this.position.y + -9,
                                        this.position.x + 9,
                                        this.position.y + 9,
                                        this.position.x + -9
                                ),
                                this.editorAttributes['position'],
                                new Vector2(-9, -9),
                                window.location.href + '/../assets/sprites/editor/widgets/transform_center.png',
                                18,
                                18,
                                Vector2.one
                        )
                ];
        }

        renderGizmo(ocular) {
                ocular.canvasContext.save();

                ocular.canvasContext.translate(this.position.x - ocular.worldPos.x, this.position.y - ocular.worldPos.y);
                ocular.canvasContext.rotate(Math.degreesToRadians(this.rotation));

                let i = 0;
                const l = this.gizmos.length;
                while (i < l) {
                        this.gizmos[i].render(ocular.canvasContext);

                        ++i;
                }

                ocular.canvasContext.restore();

                this.updateGizmoData();
        }

        // create HTML element for the editor
        createEditorCard() {
                const wrapper = new HtmlElement('div', null, {class: 'enchantment'});
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

                // collapse enchantment
                const collapse = new HtmlElement('div', null, {class: 'collapse', title: 'Collapse/Expand this enchantment'});
                collapse.addEventListener('click', function() {
                        this.closest('.enchantment').classList.toggle('open');
                });

                const collapseIcon = new HtmlElement('i', null, {class: 'fa fa-angle-down'});
                collapse.appendChild(collapseIcon);

                title.appendChild(collapse);

                // enchantment name
                const titleContent = new HtmlElement('div', this.type, {class: 'component_name'});
                title.appendChild(titleContent);

                return title;
        }
}