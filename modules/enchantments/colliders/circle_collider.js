
import { Vector2 } from './../../collection/vector2.js';
import { Bounds } from './../../collection/bounds.js';
import { Range } from './../../collection/range.js';

import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Collider } from './collider.js';

export class CircleCollider extends Collider {
        type = "Circle Collider";
        icon = "fa-circle-nodes";

        /*
         * constructor
         * @param number radius: radius of the circle
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(radius = 25, isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius, null, new Range());
        }

        updateBounds() {
                this.bounds = new Bounds(
                        this.worldPos.y - this.attributes['radius'].value,
                        this.worldPos.x + this.attributes['radius'].value,
                        this.worldPos.y + this.attributes['radius'].value,
                        this.worldPos.x - this.attributes['radius'].value
                );
        }

        renderGizmo(ocular) {
                ocular.canvasContext.save();
                ocular.canvasContext.translate(this.worldPos.x - ocular.worldPos.x, this.worldPos.y - ocular.worldPos.y);

                ocular.canvasContext.beginPath();
                ocular.canvasContext.arc(0, 0, this.attributes['radius'].value, 0, 2 * Math.PI);

                ocular.canvasContext.lineWidth = 3;
                ocular.canvasContext.strokeStyle = '#cc1133';
                ocular.canvasContext.setLineDash([3,6]);
                ocular.canvasContext.stroke();

                ocular.canvasContext.restore();
        }
}