import { Vector2 } from './collection/vector2.js';
import { CircleCollider } from './components/colliders/circle_collider.js';

export class Collision {
        collider1;
        collider2;
        rigidbody1;
        rigidbody2;
        overlap;

        /*
         * constructor
         * @param Collider collider1: first collider
         * @param Collider collider2: second collider
         * @param Vector2 overlap: the overlap of the two colliders
         *      x: positive if on the right, negative if on the left (relative to collider1)
         *      y: positive if on the bottom, negative if on the top (relative to collider1)
         */
        constructor(collider1, collider2, overlap) {
                this.collider1 = collider1;
                this.collider2 = collider2;
                this.overlap = overlap;

                this.rigidbody1 = this.collider1.gameObject.getComponent("Rigidbody");
                this.rigidbody2 = this.collider2.gameObject.getComponent("Rigidbody");
        }

        /*
         * Calculate the velocities of two colliding rigidbodies after a collision - for elastic collisions
         *      note: this currently ignores angle and direction of the collision
         * @param Rigidbody body1: first rigidbody
         * @param Rigidbody body2: second rigidbody
         */
        calculateElasticCollision(body1, body2) {
                const vFinal1 = ((body1.attributes['mass'].value - body2.attributes['mass'].value) * body1.velocity.magnitude) / (body1.attributes['mass'].value + body2.attributes['mass'].value);
                const vFinal2 = (2 * body1.attributes['mass'].value * body1.velocity.magnitude) / (body1.attributes['mass'].value + body2.attributes['mass'].value);

                body1.velocity = Vector2.multiply(body1.velocity.normalized, vFinal1);
                body2.velocity = Vector2.multiply(body2.velocity.normalized, vFinal2);
        }

        // resolve a collision
        // basically adjust positions
        resolve() {
                if (this.collider1 instanceof CircleCollider && this.collider2 instanceof CircleCollider) {
                        this.resolveCircleCircle();
                } else {
                        // adjust position/s of the rigidbody/s
                        // only one collider belongs to a rigidbody:
                        //      move rigidbody by overlap
                        // both colliders belong to a rigidbody each:
                        //      move both rigidbodies by half the overlap in opposite directions
                        const multiplier = (this.rigidbody1 && this.rigidbody2) ? 0.5 : 1;

                        if (this.rigidbody1 !== false) {
                                this.rigidbody1.gameObject.transform.attributes['position'].value = Vector2.subtract(this.rigidbody1.gameObject.transform.attributes['position'].value, Vector2.multiply(this.overlap, multiplier));
                                this.rigidbody1.velocity = Vector2.subtract(this.rigidbody1.velocity, Vector2.multiply(this.overlap.normalized(), multiplier));
                        }

                        if (this.rigidbody2 !== false) {
                                this.rigidbody2.gameObject.transform.attributes['position'].value = Vector2.subtract(this.rigidbody2.gameObject.transform.attributes['position'].value, Vector2.multiply(this.overlap, -multiplier));
                                this.rigidbody2.velocity = Vector2.subtract(this.rigidbody2.velocity, Vector2.multiply(this.overlap.normalized(), -multiplier));
                        }
                }
        }

        // resolve a collision between two circle colliders
        resolveCircleCircle() {
                // get total velocity vector of collision
                let vDiff = this.rigidbody1.velocity;
                if (this.rigidbody2 !== false) {
                        vDiff = Vector2.add(this.rigidbody1.velocity, this.rigidbody2.velocity);
                }

                // get direction of collision
                const direction = Vector2.subtract(this.collider2.worldPos, this.collider1.worldPos);

                this.rigidbody1.velocity = Vector2.add(vDiff, Vector2.divide(direction, -2)).setLength(vDiff.magnitude);

                if (this.rigidbody2 !== false) {
                        this.rigidbody2.velocity = Vector2.add(vDiff, Vector2.divide(direction, 2)).setLength(vDiff.magnitude);
                }
        }
}