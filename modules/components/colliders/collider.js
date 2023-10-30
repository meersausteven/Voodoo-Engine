
import { HtmlElement } from '../../editor/html_helpers/html_element.js';
import { Vector2 } from './../../collection/vector2.js';

import { AttributeText } from './../../editor/attributes/attribute_text.js';
import { AttributeBoolean } from './../../editor/attributes/attribute_boolean.js';
import { AttributeVector2 } from './../../editor/attributes/attribute_vector2.js';

import { Component } from './../component.js';

export class Collider extends Component {
        type = "Collider";

        /*
         * constructor
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(isTrigger = false, offset = new Vector2()) {
                super();

                this.attributes['isTrigger'] = new AttributeBoolean('Is Trigger', isTrigger);
                // this.attributes['inverted'] = new AttributeBoolean('Inverted', false);
                this.attributes['offset'] = new AttributeVector2('Offset', offset);

                this.worldPos = new Vector2();
                this.bounds = {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                };
        }

        updateWorldPos() {
                this.worldPos = new Vector2(
                        this.gameObject.transform.attributes['position'].value.x + this.attributes['offset'].value.x,
                        this.gameObject.transform.attributes['position'].value.y + this.attributes['offset'].value.y
                );
        }

        updateBounds() {
                return;
        }

        update() {
                this.updateWorldPos();
                this.updateBounds();
        }

        renderGizmo() {
                return;
        }
}