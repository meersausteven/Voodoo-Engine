
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

                this.radius = radius;
                this.distance = distance;
                this.direction = direction;

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['radius'] = new AttributeNumber('Radius', this.radius, this.set.bind(this, 'radius'));
                this.editorAttributes['distance'] = new AttributeNumber('Distance', this.distance, this.set.bind(this, 'distance'));
                this.editorAttributes['direction'] = new AttributeSelect('Direction', this.direction, ["vertical", "horizontal"], this.set.bind(this, 'direction'));
        }

        updateBounds() {
                if (this.direction === "vertical") {
                        this.bounds = new Bounds(
                                this.worldPos.y - this.distance / 2 - this.radius,
                                this.worldPos.x + this.radius,
                                this.worldPos.y + this.distance / 2 + this.radius,
                                this.worldPos.x - this.radius
                        );
                } else {
                        this.bounds = new Bounds(
                                this.worldPos.y - this.radius,
                                this.worldPos.x + this.distance / 2 + this.radius,
                                this.worldPos.y + this.radius,
                                this.worldPos.x - this.distance / 2 - this.radius
                        );
                }
        }

        renderGizmo(ocular) {
                ocular.canvasContext.save();
                ocular.canvasContext.translate(this.worldPos.x - ocular.worldPos.x, this.worldPos.y - ocular.worldPos.y);

                ocular.canvasContext.beginPath();

                if (this.direction === "vertical") {
                        ocular.canvasContext.moveTo(-this.radius, -this.distance / 2);
                        // top half circle
                        ocular.canvasContext.arc(0, -this.distance / 2, this.radius, Math.PI, 2 * Math.PI);
                        ocular.canvasContext.lineTo(this.radius, this.distance / 2);
                        // bottom half circle
                        ocular.canvasContext.arc(0, this.distance / 2, this.radius, 0, Math.PI);
                        ocular.canvasContext.lineTo(-this.radius, -this.distance / 2);
                } else {
                        ocular.canvasContext.moveTo(-this.distance / 2, -this.radius);
                        // right half circle
                        ocular.canvasContext.lineTo(this.distance / 2, -this.radius);
                        ocular.canvasContext.arc(this.distance / 2, 0, this.radius, -0.5 * Math.PI, 0.5 * Math.PI);
                        // left half circle
                        ocular.canvasContext.lineTo(-this.distance / 2, this.radius);
                        ocular.canvasContext.arc(-this.distance / 2, 0, this.radius, 0.5 * Math.PI, 1.5 * Math.PI);
                }

                ocular.canvasContext.lineWidth = 3;
                ocular.canvasContext.strokeStyle = '#cc1133';
                ocular.canvasContext.setLineDash([3,6]);
                ocular.canvasContext.stroke();

                ocular.canvasContext.restore();
        }
}