
import { Vector2 } from './../../collection/vector2.js';
import { Bounds } from './../../collection/bounds.js';
import { Range } from './../../collection/range.js';

import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeSelect } from './../../editor/attributes/attribute_select.js';

import { BoxCollider } from './box_collider.js';
import { CircleCollider } from './circle_collider.js';
import { Collider } from './collider.js';

export class CapsuleCollider extends Collider {
        type = "Capsule Collider";

        /*
         * constructor
         * @param number radius: radius of the capsule
         * @param number distance: distance between the circles' centers
         * @param nstring direction: direction of the capsule (vertical/horizontal)
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(radius = 25, distance = 50, direction = "vertical", isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius, null, new Range());
                this.attributes['distance'] = new AttributeNumber('Distance', distance, null, new Range());
                this.attributes['direction'] = new AttributeSelect('Direction', direction, ["vertical", "horizontal"]);
        }

        updateBounds() {
                if (this.attributes['direction'].value === "vertical") {
                        this.bounds = new Bounds(
                                this.worldPos.y - this.distance / 2 - this.attributes['radius'].value,
                                this.worldPos.x + this.attributes['radius'].value,
                                this.worldPos.y + this.distance / 2 + this.attributes['radius'].value,
                                this.worldPos.x - this.attributes['radius'].value
                        );
                } else {
                        this.bounds = new Bounds(
                                this.worldPos.y - this.attributes['radius'].value,
                                this.worldPos.x + this.distance / 2 + this.attributes['radius'].value,
                                this.worldPos.y + this.attributes['radius'].value,
                                this.worldPos.x - this.distance / 2 - this.attributes['radius'].value
                        );
                }
        }

        renderGizmo(ocular) {
                ocular.canvasContext.save();
                ocular.canvasContext.translate(this.worldPos.x - ocular.worldPos.x, this.worldPos.y - ocular.worldPos.y);

                ocular.canvasContext.beginPath();

                if (this.attributes['direction'].value === "vertical") {
                        ocular.canvasContext.moveTo(-this.attributes['radius'].value, -this.attributes['distance'].value / 2);
                        // top half circle
                        ocular.canvasContext.arc(0, -this.attributes['distance'].value / 2, this.attributes['radius'].value, Math.PI, 2 * Math.PI);
                        ocular.canvasContext.lineTo(this.attributes['radius'].value, this.attributes['distance'].value / 2);
                        // bottom half circle
                        ocular.canvasContext.arc(0, this.attributes['distance'].value / 2, this.attributes['radius'].value, 0, Math.PI);
                        ocular.canvasContext.lineTo(-this.attributes['radius'].value, -this.attributes['distance'].value / 2);
                } else {
                        ocular.canvasContext.moveTo(-this.attributes['distance'].value / 2, -this.attributes['radius'].value);
                        // right half circle
                        ocular.canvasContext.lineTo(this.attributes['distance'].value / 2, -this.attributes['radius'].value);
                        ocular.canvasContext.arc(this.attributes['distance'].value / 2, 0, this.attributes['radius'].value, -0.5 * Math.PI, 0.5 * Math.PI);
                        // left half circle
                        ocular.canvasContext.lineTo(-this.attributes['distance'].value / 2, this.attributes['radius'].value);
                        ocular.canvasContext.arc(-this.attributes['distance'].value / 2, 0, this.attributes['radius'].value, 0.5 * Math.PI, 1.5 * Math.PI);
                }

                ocular.canvasContext.lineWidth = 3;
                ocular.canvasContext.strokeStyle = '#cc1133';
                ocular.canvasContext.setLineDash([3,6]);
                ocular.canvasContext.stroke();

                ocular.canvasContext.restore();
        }
}