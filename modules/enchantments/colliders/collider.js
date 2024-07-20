
import { Vector2 } from './../../collection/vector2.js';
import { Bounds } from './../../collection/bounds.js';

import { AttributeBoolean } from './../../editor/attributes/attribute_boolean.js';
import { AttributeVector2 } from './../../editor/attributes/attribute_vector2.js';

import { Enchantment } from './../enchantment.js';

export class Collider extends Enchantment {
        type = "Collider";
        icon = "fa-burst";

        /*
         * constructor
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(isTrigger = false, offset = new Vector2()) {
                super();

                this.isTrigger = isTrigger;
                this.offset = offset;
                //this.inverted = false;
                this.worldPos = new Vector2();
                this.bounds = new Bounds(0, 0, 0, 0);

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['isTrigger'] = new AttributeBoolean('Is Trigger', this.isTrigger, this.set.bind(this, 'isTrigger'));
                this.editorAttributes['offset'] = new AttributeVector2('Offset', this.offset, this.set.bind(this, 'offset'));
                // this.editorAttributes['inverted'] = new AttributeBoolean('Inverted', false, this.set.bind(this, 'inverted'));
        }

        updateWorldPos() {
                this.worldPos = new Vector2(
                        this.talisman.transform.position.x + this.offset.x,
                        this.talisman.transform.position.y + this.offset.y
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