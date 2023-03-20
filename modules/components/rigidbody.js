
import { Vector2 } from './../collection/vector2.js';
import { Range } from './../collection/range.js';

import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';
import { AttributeVector2 } from './../editor/attributes/attribute_vector2.js';

import { Component } from './component.js';

export class Rigidbody extends Component {
        type = "Rigidbody";

        constructor() {
                super();

                this.attributes['velocity'] = new Vector2();
                this.attributes['initialVelocity'] = new AttributeVector2('Initial Velocity', new Vector2());
                this.attributes['obeyGravity'] = new AttributeBoolean('Obey Gravity', true);
                this.attributes['canCollide'] = new AttributeBoolean('Can Collide', true);
                this.attributes['mass'] = new AttributeNumber('Mass', 1, null, new Range(-Number.MAX_VALUE));
                this.attributes['gravityMultiplier'] = new AttributeNumber('Gravity Multiplier', 1, null, new Range(-Number.MAX_VALUE));
                this.attributes['frictionMultiplier'] = new AttributeNumber('Friction Multiplier', 1, null, new Range(-Number.MAX_VALUE));
        }

        start() {
                this.attributes['velocity'] = Vector2.add(this.attributes['velocity'], this.attributes['initialVelocity'].value);
        }

        update() {
                if (this.attributes['obeyGravity'].value === true) {
                        // calculate force this Rigidbody is pulled towards other Rigidbodies with their given mass
                        if (this.gameObject.scene.project.physics.attributes['massGravity'].value === true) {
                                let i = 0;
                                let l = this.gameObject.scene.gameObjects.length;

                                while (i < l) {
                                        let otherObject = this.gameObject.scene.gameObjects[i];

                                        // exclude self from calculations
                                        if (otherObject === this.gameObject) {
                                                ++i;

                                                continue;
                                        }

                                        if (otherObject.getComponent('Rigidbody') !== false) {
                                                let otherBody = otherObject.getComponent('Rigidbody');

                                                let toOtherObject = Vector2.subtract(otherObject.transform.attributes['position'].value, this.gameObject.transform.attributes['position'].value);
                                                let distance = toOtherObject.magnitude;

                                                let force = Math.G * Math.pow(10, 11) * ((this.attributes['mass'].value * otherBody.attributes['mass'].value) / (distance * distance));
                                                let acceleration = force / this.attributes['mass'].value;

                                                let vectorTowardsOtherObject = Vector2.multiply(toOtherObject.lengthen(acceleration), time.delta);

                                                this.attributes['velocity'] = Vector2.add(this.attributes['velocity'], vectorTowardsOtherObject);
                                        }

                                        ++i;
                                }
                        } else {
                                // mass is set to not create gravity - use default gravity vector

                                // add the gravity (multiplied by the time since the last frame) to this Rigidbody's velocity
                                let physicsGravity = this.gameObject.scene.project.physics.attributes['gravity'].value;
                                this.attributes['velocity'] = Vector2.add(this.attributes['velocity'], Vector2.multiply(physicsGravity, time.delta));

                                // decrease velocity according to friction
                                let physicsFriction = this.gameObject.scene.project.physics.attributes['airResistance'].value;
                                physicsFriction = Vector2.multiply(physicsFriction, this.attributes['frictionMultiplier'].value);

                                this.attributes['velocity'] = Vector2.divide(this.attributes['velocity'], physicsFriction);
                        }
                }

                // set velocity to zero if it's small enough
                if (this.attributes['velocity'].magnitude < 0.01) {
                        this.attributes['velocity'] = new Vector2();
                }

                // move the gameObject according to its velocity
                this.gameObject.transform.attributes['position'].value = Vector2.add(this.gameObject.transform.attributes['position'].value, this.attributes['velocity']);
        }

        // adds a given force to this Rigidbody
        // todo: properly implement a force calculation -> F = m * a
        addForce(force) {
                this.attributes['velocity'] = Vector2.add(this.attributes['velocity'], force);
        }
}
