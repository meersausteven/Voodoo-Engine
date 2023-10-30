
import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Collider } from './collider.js';

export class BoxCollider extends Collider {
        type = "Box Collider";

        /*
         * constructor
         * @param number width: width of the rectangle
         * @param number height: height of the rectangle
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(width = 50, height = 50, isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['width'] = new AttributeNumber('Width', width, null, new Range());
                this.attributes['height'] = new AttributeNumber('Height', height, null, new Range());
        }

        updateBounds() {
                this.bounds = {
                        top: this.worldPos.y - (this.attributes['height'].value / 2),
                        right: this.worldPos.x + (this.attributes['width'].value / 2),
                        bottom: this.worldPos.y + (this.attributes['height'].value / 2),
                        left: this.worldPos.x - (this.attributes['width'].value / 2)
                };
        }

        renderGizmo(camera) {
                camera.canvasContext.save();
                camera.canvasContext.translate(this.worldPos.x - camera.worldPos.x, this.worldPos.y - camera.worldPos.y);

                camera.canvasContext.lineWidth = 1;
                camera.canvasContext.strokeStyle = '#cc1133';
                camera.canvasContext.strokeRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                camera.canvasContext.restore();
        }
}