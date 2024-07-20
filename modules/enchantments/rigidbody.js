
import { Vector2 } from './../collection/vector2.js';
import { Range } from './../collection/range.js';

import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';
import { AttributeVector2 } from './../editor/attributes/attribute_vector2.js';

import { Enchantment } from './enchantment.js';

export class Rigidbody extends Enchantment {
        type = "Rigidbody";
        icon = "fa-person-falling";

        constructor() {
                super();

                this.velocity = new Vector2();
                this.initialVelocity = new Vector2();
                this.obeyGravity = true;
                this.canCollide = true;
                this.mass = 1;
                this.gravityMultiplier = 1;
                this.frictionMultiplier = 1;

                this.createAttributes();
        }

        start() {
                this.velocity = Vector2.add(this.velocity, this.initialVelocity);
        }

        update() {
                if (this.obeyGravity === true) {
                        // todo: move feature to Fizzle
                        // calculate force this Rigidbody is pulled towards other Rigidbodies with their given mass
                        if (this.talisman.scene.project.fizzle.massGravity === true) {
                                let i = 0;
                                const l = this.talisman.scene.talismans.length;

                                while (i < l) {
                                        const otherObject = this.talisman.scene.talismans[i];

                                        // exclude self from calculations
                                        if (otherObject === this.talisman) {
                                                ++i;

                                                continue;
                                        }

                                        if (otherObject.getEnchantment('Rigidbody') !== false) {
                                                const otherBody = otherObject.getEnchantment('Rigidbody');

                                                const toOtherObject = Vector2.subtract(otherObject.transform.position, this.talisman.transform.position);
                                                const distance = toOtherObject.magnitude;

                                                const force = Math.G * Math.pow(10, 11) * ((this.mass * otherBody.mass) / (distance * distance));
                                                const acceleration = force / this.mass;

                                                const vectorTowardsOtherObject = Vector2.multiply(toOtherObject.lengthen(acceleration), window.time.delta);

                                                this.velocity = Vector2.add(this.velocity, vectorTowardsOtherObject);
                                        }

                                        ++i;
                                }
                        } else {
                                // mass is set to not create gravity - use default gravity vector

                                // add the gravity (multiplied by the time since the last frame) to this Rigidbody's velocity
                                const physicsGravity = this.talisman.scene.project.fizzle.gravity;
                                this.velocity = Vector2.add(this.velocity, Vector2.multiply(physicsGravity, window.time.delta));

                                // decrease velocity according to friction
                                let physicsFriction = this.talisman.scene.project.fizzle.airResistance;
                                physicsFriction = Vector2.multiply(physicsFriction, this.frictionMultiplier);

                                this.velocity = Vector2.divide(this.velocity, physicsFriction);
                        }
                }

                // set velocity to zero if it's small enough
                if (this.velocity.magnitude < 0.01) {
                        this.velocity = new Vector2();
                }

                // move the talisman according to its velocity
                this.talisman.transform.position = Vector2.add(this.talisman.transform.position, this.velocity);
        }

        createAttributes() {
                this.editorAttributes['initialVelocity'] = new AttributeVector2('Initial Velocity', this.initialVelocity, this.set.bind(this, 'initialVelocity'));
                this.editorAttributes['obeyGravity'] = new AttributeBoolean('Obey Gravity', this.obeyGravity, this.set.bind(this, 'obeyGravity'));
                this.editorAttributes['canCollide'] = new AttributeBoolean('Can Collide', this.canCollide, this.set.bind(this, 'canCollide'));
                this.editorAttributes['mass'] = new AttributeNumber('Mass', this.mass, this.set.bind(this, 'mass'));
                this.editorAttributes['gravityMultiplier'] = new AttributeNumber('Gravity Multiplier', this.gravityMultiplier, this.set.bind(this, 'gravityMultiplier'));
                this.editorAttributes['frictionMultiplier'] = new AttributeNumber('Friction Multiplier', this.frictionMultiplier, this.set.bind(this, 'frictionMultiplier'));
        }

        /*
        * @param number force: force that is to be added
        * @param number height: height of the rectangle
        * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
        * @param Vector2 offset: offset relative to this talisman's position
        */
        addForce(force, direction = Vector2.up) {
                this.velocity += Vector2.multiply(direction, force / this.mass);
        }
}
