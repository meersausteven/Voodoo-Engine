import { Vector2 } from './collection/vector2.js';

import { AttributeBoolean } from './editor/attributes/attribute_boolean.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';

export class Physics {
        attributes = {};

        constructor() {
                this.attributes['gravity'] = new AttributeVector2('Gravity', new Vector2(0, 9.81));
                this.attributes['airResistance'] = new AttributeVector2('Air Resistance', new Vector2(1.02, 1.02));
                this.attributes['massGravity'] = new AttributeBoolean('Mass creates gravity', false);
        }

        // todo: differenciate between roguh collision detection and precise collision detection
        //      rough detection: only take the bounding boxes of colliders for faster calculation
        //      precise detection: take exact bounds of circles / polygons for precise calculation
        //      precise calculations take more time so they should only be done if the rough detection in the previous frame returned true

        /*
         * Check if a given point is inside a box collider
         * @param BoxCollider box: the box collider
         * @param Vector2 point: the point to check
         * @return boolean: true if point is inside box; false if not
         */
        checkPointInBox(box, point) {
                if ((point.x > box.bounds.left) &&
                    (point.x < box.bounds.right) &&
                    (point.y > box.bounds.top) &&
                    (point.y < box.bounds.bottom)
                ) {
                        return true;
                }

                return false;
        }

        /*
         * Check if a given point is inside a circle collider
         * @param CircleCollider circle: the circle collider
         * @param Vector2 point: the point to check
         * @return boolean: true if point is inside circle; false if not
         */
        checkPointInCircle(circle, point) {
                const distance = Vector2.subtract(point, circle.worldPos);
                if (distance.magnitude <= circle.attributes['radius']) {
                        return true;
                }

                return false;
        }

        /*
         * Check if the bounds of two colliders of any kind are touching/overlapping
         * Should only be used for box colliders or for rough collision detection
         * @param Collider collider1: first collider
         * @param Collider collider2: second collider
         * @return boolean: true if touching/overlapping; false if not
         */
        checkBoundsOverlap(collider1, collider2) {
                if ((collider1.bounds.right > collider2.bounds.left) &&
                    (collider1.bounds.left < collider2.bounds.right) &&
                    (collider1.bounds.bottom > collider2.bounds.top) &&
                    (collider1.bounds.top < collider2.bounds.bottom)
                ) {
                        return true;
                }

                return false;
        }

        /*
         * Check if two box colliders are touching/overlapping
         * @param BoxCollider box1: first box collider
         * @param BoxCollider box2: second box collider
         * @return boolean: true if touching/overlapping; false if not
         */
        checkBoxesOverlap(box1, box2) {
                // boxes only use their bounds to check for collision
                return this.checkBoundsOverlap(box1, box2);
        }

        /*
         * Check if two circle colliders are touching/overlapping
         * @param CircleCollider circle1: first circle collider
         * @param CircleCollider circle2: second circle collider
         * @return boolean: true if touching/overlapping; false if not
         */
        checkCirclesOverlap(circle1, circle2) {
                const distance = Vector2.subtract(circle1.worldPos, circle2.worldPos);
                if (distance.magnitude <= circle1.attributes['radius'] + circle2.attributes['radius']) {
                        return true;
                }

                return false;
        }

        /*
         * Check if a circle and a box collider are touching/overlapping
         * @param BoxCollider box: the box collider
         * @param CircleCollider circle: the circle collider
         * @return boolean: true if touching/overlapping; false if not
         */
        checkCircleBoxOverlap(box, circle) {
                const topDist = Math.abs(box.bounds.top - circle.worldPos.y);
                const leftDist = Math.abs(box.bounds.left - circle.worldPos.x);
                const bottomDist = Math.abs(box.bounds.bottom - circle.worldPos.y);
                const rightDist = Math.abs(box.bounds.right - circle.worldPos.x);

                const min = Math.min([topDist, leftDist, bottomDist, rightDist]);

                if (min <= circle.radius) {
                        return true;
                }

                return false;
        }

        /*
         * Calculate the velocities of two colliding rigidbodies after a collision - for elastic collisions
         *      note: this currently ignores angle and direction of the collision
         * @param Rigidbody body1: first rigidbody
         * @param Rigidbody body2: second rigidbody
         */
        calculateElasticCollision(body1, body2) {
                const vFinal1 = ((body1.mass - body2.mass) * body1.velocity.magnitude) / (body1.mass + body2.mass);
                const vFinal2 = (2 * body1.mass * body1.velocity.magnitude) / (body1.mass + body2.mass);

                body1.velocity = Vector2.multiply(body1.velocity.normalized, vFinal1);
                body2.velocity = Vector2.multiply(body2.velocity.normalized, vFinal2);
        }
}