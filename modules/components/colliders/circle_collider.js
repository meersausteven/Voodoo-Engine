
import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Collider } from './collider.js';

export class CircleCollider extends Collider {
        type = "Circle Collider";

        /*
         * constructor
         * @param number radius: radius of the circle
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(radius = 25, isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius, null, new Range());
        }

        updateBounds() {
                this.bounds = {
                        top: this.worldPos.y - this.attributes['radius'].value,
                        right: this.worldPos.x + this.attributes['radius'].value,
                        bottom: this.worldPos.y + this.attributes['radius'].value,
                        left: this.worldPos.x - this.attributes['radius'].value
                };
        }

        renderGizmo(camera) {
                camera.canvasContext.save();
                camera.canvasContext.translate(this.worldPos.x - camera.worldPos.x, this.worldPos.y - camera.worldPos.y);

                camera.canvasContext.beginPath();
                camera.canvasContext.arc(0, 0, this.attributes['radius'].value, 0, 2 * Math.PI);

                camera.canvasContext.lineWidth = 1;
                camera.canvasContext.strokeStyle = '#cc1133';
                camera.canvasContext.stroke();

                camera.canvasContext.restore();
        }
}