
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

                this.attributes['isTrigger'] = new AttributeBoolean('Is Trigger', isTrigger);
                // this.attributes['inverted'] = new AttributeBoolean('Inverted', false);
                this.attributes['offset'] = new AttributeVector2('Offset', offset);

                this.worldPos = new Vector2();
                this.bounds = new Bounds(0, 0, 0, 0);
        }

        updateWorldPos() {
                this.worldPos = new Vector2(
                        this.talisman.transform.attributes['position'].value.x + this.attributes['offset'].value.x,
                        this.talisman.transform.attributes['position'].value.y + this.attributes['offset'].value.y
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