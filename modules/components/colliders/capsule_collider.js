
import { Vector2 } from './../../collection/vector2.js';

import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeText } from './../../editor/attributes/attribute_text.js';

import { BoxCollider } from './box_collider.js';
import { CircleCollider } from './circle_collider.js';
import { Collider } from './collider.js';

export class CapsuleCollider extends Collider {
        type = "Capsule Collider";

        constructor(radius, distance, isTrigger = false, offset = new Vector2(), direction = "horizontal") {
                // GameObject gameObject: the gameObject this component belongs to
                // int radius: radius of the circles on the ends
                // int distance: distance between the circles' centers
                // string direction: direction of the capsule ("horizontal" or "vertical")
                // Vector2 offset: offset from bottom center of this gameObject
                super(isTrigger, offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius);
                this.attributes['distance'] = new AttributeNumber('Distance', distance);
                this.attributes['direction'] = new AttributeText('Direction', direction);
        }

        start() {
                // arrange the colliders making up the capsule depending on the direction it's going
                let boxWidth, boxHeight = 0;
                let boxOff, firstCircleOff, secondCircleOff = new Vector2();
                
                if (this.attributes['direction'].value == "horizontal") {
                        boxWidth = this.attributes['distance'].value;
                        boxHeight = this.attributes['radius'].value * 2;
                        boxOff = new Vector2(
                                this.attributes['offset'].value.x,
                                this.attributes['offset'].value.y
                        );
                        // left circle
                        firstCircleOff = new Vector2(
                                this.attributes['offset'].value.x - (boxWidth / 2),
                                this.attributes['offset'].value.y - this.attributes['radius'].value
                        );
                        // right circle
                        secondCircleOff = new Vector2(
                                this.attributes['offset'].value.x + (boxWidth / 2),
                                this.attributes['offset'].value.y - this.attributes['radius'].value
                        );
                } else {
                        boxWidth = this.attributes['radius'].value * 2;
                        boxHeight = this.attributes['distance'].value;
                        boxOff = new Vector2(
                                this.attributes['offset'].value.x,
                                this.attributes['offset'].value.y
                        );
                        // top circle
                        firstCircleOff = new Vector2(
                                this.attributes['offset'].value.x,
                                this.attributes['offset'].value.y - boxHeight - this.attributes['radius'].value
                        );
                        // bottom circle
                        secondCircleOff = new Vector2(
                                this.attributes['offset'].value.x,
                                this.attributes['offset'].value.y + this.attributes['radius'].value
                        );
                }

                // build a capsule using two circle- and one box-collider
                this.gameObject.addComponent(
                        new CircleCollider(this.attributes['radius'].value, this.attributes['isTrigger'].value, firstCircleOff.x, firstCircleOff.y)
                );
                this.gameObject.addComponent(       
                        new BoxCollider(boxWidth, boxHeight, this.attributes['isTrigger'].value, boxOff.x, boxOff.y)
                ); 
                this.gameObject.addComponent(
                        new CircleCollider(this.attributes['radius'].value, this.attributes['isTrigger'].value, secondCircleOff.x, secondCircleOff.y)
                );
                
                // remove this fake collider from this parents colliders
                this.gameObject.components = this.gameObject.components.filter(el => el.type !== this.type);
        }
}