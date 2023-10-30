
import { Vector2 } from './../../collection/vector2.js';
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
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(radius = 25, distance = 50, direction = "vertical", isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius, null, new Range());
                this.attributes['distance'] = new AttributeNumber('Distance', distance, null, new Range());
                this.attributes['direction'] = new AttributeSelect('Direction', direction, ["vertical", "horizontal"]);
        }

        updateBounds() {
                if (this.attributes['direction'].value === "vertical") {
                        this.bounds = {
                                top: this.worldPos.y - this.distance / 2 - this.attributes['radius'].value,
                                right: this.worldPos.x + this.attributes['radius'].value,
                                bottom: this.worldPos.y + this.distance / 2 + this.attributes['radius'].value,
                                left: this.worldPos.x - this.attributes['radius'].value
                        };
                } else {
                        this.bounds = {
                                top: this.worldPos.y - this.attributes['radius'].value,
                                right: this.worldPos.x + this.distance / 2 + this.attributes['radius'].value,
                                bottom: this.worldPos.y + this.attributes['radius'].value,
                                left: this.worldPos.x - this.distance / 2 - this.attributes['radius'].value
                        };
                }
        }

        renderGizmo(camera) {
                camera.canvasContext.save();
                camera.canvasContext.translate(this.worldPos.x - camera.worldPos.x, this.worldPos.y - camera.worldPos.y);

                camera.canvasContext.beginPath();

                if (this.attributes['direction'].value === "vertical") {
                        // top half circle
                        camera.canvasContext.arc(0, -this.attributes['distance'].value / 2, this.attributes['radius'].value, Math.PI, 2 * Math.PI);
                        // bottom half circle
                        camera.canvasContext.arc(0, this.attributes['distance'].value / 2, this.attributes['radius'].value, 0, Math.PI);
                        camera.canvasContext.lineTo(-this.attributes['radius'].value, -this.attributes['distance'].value + this.attributes['radius'].value);
                } else {
                        // left half circle
                        camera.canvasContext.arc(-this.attributes['distance'].value / 2, 0, this.attributes['radius'].value, 0.5 * Math.PI, 1.5 * Math.PI);
                        // right half circle
                        camera.canvasContext.arc(this.attributes['distance'].value / 2, 0, this.attributes['radius'].value, -0.5 * Math.PI, 0.5 * Math.PI);
                        camera.canvasContext.lineTo(-this.attributes['distance'].value + this.attributes['radius'].value, this.attributes['radius'].value );
                }

                camera.canvasContext.lineWidth = 1;
                camera.canvasContext.strokeStyle = '#cc1133';
                camera.canvasContext.stroke();

                camera.canvasContext.restore();
        }
}