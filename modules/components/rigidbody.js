
import { Vector2 } from './../collection/vector2.js';
import { Range } from './../collection/range.js';

import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';
import { AttributeVector2 } from './../editor/attributes/attribute_vector2.js';

import { Component } from './component.js';

export class Rigidbody extends Component {
        type = "Rigidbody";
        velocity = new Vector2();

        constructor() {
                super();

                this.attributes['initialVelocity'] = new AttributeVector2('Initial Velocity', new Vector2());
                this.attributes['obeyGravity'] = new AttributeBoolean('Obey Gravity', true);
                this.attributes['canCollide'] = new AttributeBoolean('Can Collide', true);
                this.attributes['mass'] = new AttributeNumber('Mass', 1, null, new Range(-Number.MAX_VALUE));
                this.attributes['gravityMultiplier'] = new AttributeNumber('Gravity Multiplier', 1, null, new Range(-Number.MAX_VALUE));
                this.attributes['frictionMultiplier'] = new AttributeNumber('Friction Multiplier', 1, null, new Range(-Number.MAX_VALUE));
        }

        start() {
                this.velocity = Vector2.add(this.velocity, this.attributes['initialVelocity'].value);
        }

        update() {
                if (this.attributes['obeyGravity'].value === true) {
                        // calculate force this Rigidbody is pulled towards other Rigidbodies with their given mass
                        if (this.gameObject.scene.project.physicsEngine.attributes['massGravity'].value === true) {
                                let i = 0;
                                const l = this.gameObject.scene.gameObjects.length;

                                while (i < l) {
                                        const otherObject = this.gameObject.scene.gameObjects[i];

                                        // exclude self from calculations
                                        if (otherObject === this.gameObject) {
                                                ++i;

                                                continue;
                                        }

                                        if (otherObject.getComponent('Rigidbody') !== false) {
                                                const otherBody = otherObject.getComponent('Rigidbody');

                                                const toOtherObject = Vector2.subtract(otherObject.transform.attributes['position'].value, this.gameObject.transform.attributes['position'].value);
                                                const distance = toOtherObject.magnitude;

                                                const force = Math.G * Math.pow(10, 11) * ((this.attributes['mass'].value * otherBody.attributes['mass'].value) / (distance * distance));
                                                const acceleration = force / this.attributes['mass'].value;

                                                const vectorTowardsOtherObject = Vector2.multiply(toOtherObject.lengthen(acceleration), window.time.delta);

                                                this.velocity = Vector2.add(this.velocity, vectorTowardsOtherObject);
                                        }

                                        ++i;
                                }
                        } else {
                                // mass is set to not create gravity - use default gravity vector

                                // add the gravity (multiplied by the time since the last frame) to this Rigidbody's velocity
                                const physicsGravity = this.gameObject.scene.project.physicsEngine.attributes['gravity'].value;
                                this.velocity = Vector2.add(this.velocity, Vector2.multiply(physicsGravity, window.time.delta));

                                // decrease velocity according to friction
                                let physicsFriction = this.gameObject.scene.project.physicsEngine.attributes['airResistance'].value;
                                physicsFriction = Vector2.multiply(physicsFriction, this.attributes['frictionMultiplier'].value);

                                this.velocity = Vector2.divide(this.velocity, physicsFriction);
                        }
                }

                // set velocity to zero if it's small enough
                if (this.velocity.magnitude < 0.01) {
                        this.velocity = new Vector2();
                }

                // move the gameObject according to its velocity
                this.gameObject.transform.attributes['position'].value = Vector2.add(this.gameObject.transform.attributes['position'].value, this.velocity);
        }

        /*
        * @param number force: force that is to be added
        * @param number height: height of the rectangle
        * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
        * @param Vector2 offset: offset relative to this gameObject's position
        */
        addForce(force, direction = Vector2.up) {
                this.velocity += Vector2.multiply(direction, force / this.attributes['mass'].value);
        }
}
