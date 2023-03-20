
import { Vector2 } from './../../collection/vector2.js';

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
        constructor(radius, isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius);
        }

        checkPointInside(x, y) {
                // calculate coords on canvas by taking in the coords of its gameObject
                let distPoints = (x - this.attributes['worldPos'].x) * (x - this.attributes['worldPos'].x) + (y - this.attributes['worldPos'].y) * (y - this.attributes['worldPos'].y);
                let r = this.attributes['radius'].value;
                r *= r;

                if (distPoints < r) {
                        return true;
                }

                return false;
        }

        checkColliderOverlapping(otherCollider, checkPos = null) {
                // checkPosition is the position where collision should be checked
                // if null use the gameObject's position
                if (checkPos != null) {
                        checkPos = new Vector2(
                                checkPos.x + this.attributes['offset'].value.x - this.gameObject.scene.activeCamera.pos.x,
                                checkPos.y + this.attributes['offset'].value.y - this.gameObject.scene.activeCamera.pos.y
                        );
                }

                switch (otherCollider.type) {
                        case "Circle Collider":
                                return circlesOverlapping(this, otherCollider, checkPos);
                        case "Box Collider":
                                return circleBoxOverlapping(this, otherCollider, checkPos, this.type);
                        default:
                                return
                }
        }

        // todo: turn into a gizmo for the editor
        displayBounds() {
                let context = this.gameObject.scene.project.canvasContext;

                context.save();
                context.translate(this.attributes['worldPos'].x, this.attributes['worldPos'].y);

                context.beginPath();
                context.arc(0, 0, this.attributes['radius'].value, 0, 2 * Math.PI);

                context.lineWidth = 2;
                context.strokeStyle = '#11ff22';
                context.stroke();

                context.lineWidth = 5;
                context.setLineDash([4, (this.attributes['radius'].value * 2 * Math.PI) / 4 - 4]);
                context.strokeStyle = '#11ff22';
                context.stroke();

                context.restore();
        }
}