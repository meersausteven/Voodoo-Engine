import { Vector2 } from './collection/vector2.js';

import { AttributeBoolean } from './editor/attributes/attribute_boolean.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';

import { Collision } from './collision.js';
import { CircleCollider } from './components/colliders/circle_collider.js';

export class PhysicsEngine {
        attributes = {};
        colliders = [];
        rigidbodies = [];

        constructor() {
                this.attributes['gravity'] = new AttributeVector2('Gravity', new Vector2(0, 9.81));
                this.attributes['airResistance'] = new AttributeVector2('Air Resistance', new Vector2(1.02, 1.02));
                this.attributes['massGravity'] = new AttributeBoolean('Mass creates gravity', false);
        }

        addCollider(collider) {
                this.colliders.push(collider);
        }

        addRigidbody(rigidbody) {
                this.rigidbodies.push(rigidbody);
        }

        removeCollider(collider) {
                const index = this.colliders.indexOf(collider);

                this.colliders.splice(index, 1);
        }

        removeRigidbody(rigidbody) {
                const index = this.rigidbodies.indexOf(rigidbody);

                this.rigidbodies.splice(index, 1);
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
                if (distance.magnitude <= circle.attributes['radius'].value) {
                        return true;
                }

                return false;
        }

        /*
         * Check if the bounds of two colliders of any kind are touching/overlapping
         * Should only be used for box colliders or for rough collision detection
         * @param Collider collider1: first collider
         * @param Collider collider2: second collider
         * @return boolean|Collision: Collision if touching/overlapping; false if not
         * // todo: only return true/false after adding rotated colliders
         *          they will only feature the left-most, right-most, top-most and bottom-most coordinates
         */
        checkBoundsOverlap(collider1, collider2) {
                const rightOverlap = collider1.bounds.right - collider2.bounds.left;
                const leftOverlap = collider1.bounds.left - collider2.bounds.right;
                const bottomOverlap = collider1.bounds.bottom - collider2.bounds.top;
                const topOverlap = collider1.bounds.top - collider2.bounds.bottom;

                if (rightOverlap > 0 &&
                    leftOverlap < 0 &&
                    bottomOverlap > 0 &&
                    topOverlap < 0
                ) {
                        // return true;

                        let xOverlap = Math.min(Math.abs(leftOverlap), Math.abs(rightOverlap))
                        let yOverlap = Math.min(Math.abs(topOverlap), Math.abs(bottomOverlap));

                        if ((collider1.bounds.right < collider2.bounds.right) &&
                            (collider1.bounds.left > collider2.bounds.left)) {
                                xOverlap = 0;
                        }

                        if ((collider1.bounds.bottom < collider2.bounds.bottom) &&
                            (collider1.bounds.top > collider2.bounds.top)) {
                                yOverlap = 0;
                        }

                        const collision = new Collision(collider1, collider2, new Vector2(xOverlap, yOverlap));

                        return collision;
                }

                return false;
        }

        /*
         * Check if two box colliders are touching/overlapping
         * @param BoxCollider box1: first box collider
         * @param BoxCollider box2: second box collider
         * @return boolean|Collision: Collision if touching/overlapping; false if not
         */
        checkBoxesOverlap(box1, box2) {
                // boxes only use their bounds to check for collision
                // todo: in the future bounds will not work on rotated box colliders
                //      they will only feature the left-most, right-most, top-most and bottom-most coordinates
                return this.checkBoundsOverlap(box1, box2);
        }

        /*
         * Check if two circle colliders are touching/overlapping
         * @param CircleCollider circle1: first circle collider
         * @param CircleCollider circle2: second circle collider
         * @return boolean|Collision: Collision if touching/overlapping; false if not
         */
        checkCirclesOverlap(circle1, circle2) {
                const circlesVector = Vector2.subtract(circle1.worldPos, circle2.worldPos);
                const distance = circlesVector.magnitude - (circle1.attributes['radius'].value + circle2.attributes['radius'].value);

                if (distance <= 0) {
                        const collision = new Collision(circle1, circle2, circlesVector.setLength(Math.abs(distance)));

                        return collision;
                }

                return false;
        }

        /*
         * Check if a circle and a box collider are touching/overlapping
         * @param BoxCollider box: the box collider
         * @param CircleCollider circle: the circle collider
         * @return boolean|Collision: Collision if touching/overlapping; false if not
         */
        checkCircleBoxOverlap(box, circle) {
                const topDist = Math.abs(box.bounds.top - circle.worldPos.y);
                const leftDist = Math.abs(box.bounds.left - circle.worldPos.x);
                const bottomDist = Math.abs(box.bounds.bottom - circle.worldPos.y);
                const rightDist = Math.abs(box.bounds.right - circle.worldPos.x);

                // get the smallest distance between box and circle on the x and y axis
                const xMin = Math.min([leftDist, rightDist]);
                const yMin = Math.min([topDist, bottomDist]);

                // check if the smallest distance is smaller than the circle's radius
                const absMin = Math.min([xMin, yMin]);
                if (absMin <= circle.attributes['radius'].value) {
                        const collision = new Collision(box, circle, new Vector2(xMin, yMin));

                        return collision;
                }

                return false;
        }

        calculateCollisions() {
                let i = 0;
                let l = this.rigidbodies.length;

                while (i < l) {
                        const rigidbody = this.rigidbodies[i];

                        if (rigidbody.gameObject === null) {
                                this.removeRigidbody(rigidbody);
                                l = this.rigidbodies.length;

                                continue;
                        }

                        const collider = rigidbody.gameObject.getComponent("Collider");

                        // don't have to do anything if there is no collider attached to the rigidbody
                        if (collider !== false) {
                                let j = 0;
                                let k = this.colliders.length;

                                while (j < k) {
                                        const otherCollider = this.colliders[j];

                                        if (otherCollider.gameObject === null) {
                                                this.removeCollider(otherCollider);
                                                k = this.colliders.length;

                                                continue;
                                        }

                                        // only check for collisions with other gameObjects' colliders
                                        if (rigidbody.gameObject !== otherCollider.gameObject) {
                                                let collision;
                                                if (collider instanceof CircleCollider && otherCollider instanceof CircleCollider) {
                                                        collision = this.checkCirclesOverlap(collider, otherCollider);
                                                } else {
                                                        collision = this.checkBoundsOverlap(collider, otherCollider);
                                                }

                                                if (collision !== false) {
                                                        collision.resolve();
                                                }
                                        }

                                        ++j;
                                }
                        }

                        ++i;
                }
        }
}