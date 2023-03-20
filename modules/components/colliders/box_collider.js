
import { Vector2 } from './../../collection/vector2.js';

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
        constructor(width = 0, height = 0, isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.attributes['width'] = new AttributeNumber('Width', width);
                this.attributes['height'] = new AttributeNumber('Height', height);
        }

        checkPointInside(x, y) {
                // calculate coords on canvas by taking in the coords of its gameObject
                if ( valueBetween(x, this.attributes['worldPos'].x - (this.attributes['width'].value / 2), this.attributes['worldPos'].x + (this.attributes['width'].value / 2)) &&
                     valueBetween(y, this.attributes['worldPos'].y - this.attributes['height'].value, this.attributes['worldPos'].y) ) {
                        return true;
                }

                return false;
        }

        checkColliderOverlapping(otherCollider, checkPos = null) {
                // checkPosition is the position where collision should be checked
                // if null use the gameObject's position
                if (checkPos != null) {
                        checkPos = new Vector2(
                                checkPos.x + this.attributes['offset'].value.x - this.gameObject.scene.activeCamera.components[0].attributes['position'].value.x,
                                checkPos.y + this.attributes['offset'].value.y - this.gameObject.scene.activeCamera.components[0].attributes['position'].value.y
                        );
                }
                
                switch (otherCollider.type) {
                        case "Collider/Cicle Collider":
                                return circleBoxOverlapping(otherCollider, this, checkPos, this.type);
                        case "Collider/Box Collider":
                                return boxesOverlapping(this, otherCollider, checkPos);
                        default:
                                return
                }
        }

        displayBounds() {
                let context = this.gameObject.scene.project.canvasContext;

                context.save();
                context.translate(this.attributes['worldPos'].x, this.attributes['worldPos'].y);
                
                context.lineWidth = 2;
                context.strokeStyle = '#11ff22';
                context.strokeRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);
                
                context.lineWidth = 5;
                context.setLineDash([0, (this.attributes['width'].value - 4) / 2, 4, (this.attributes['width'].value - 4) / 2, 0, (this.attributes['height'].value - 4) / 2, 4, (this.attributes['height'].value - 4) / 2]);
                context.strokeRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                context.restore();
        }
}