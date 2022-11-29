
import { Vector2 } from './../collection/vector2.js';

import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';

import { Component } from './component.js';

export class Rigidbody extends Component {
        type = "Rigidbody";

        constructor() {
                super();

                this.attributes['velocity'] = new Vector2();
                this.attributes['obeyGravity'] = new AttributeBoolean('Obey Gravity', true);
                this.attributes['canCollide'] = new AttributeBoolean('Can Collide', true);
                this.attributes['mass'] = new AttributeNumber('Mass', 1);
                this.attributes['gravityMultiplier'] = new AttributeNumber('Gravity Multiplier', 1);
                this.attributes['frictionMultiplier'] = new AttributeNumber('Friction Multiplier', 1);
        }

        update() {
                // increase velocity according to gravity
                let physicsGravity = new Vector2(this.gameObject.scene.project.physics.attributes['gravity'].value.x, this.gameObject.scene.project.physics.attributes['gravity'].value.y);
                physicsGravity = Vector2.multiply(physicsGravity, time.deltaTime);

                if (this.attributes['obeyGravity'].value === true) {
                        this.attributes['velocity'] = Vector2.add(this.attributes['velocity'], physicsGravity);
                }

                // apply velocity to gameObject
                this.gameObject.transform.attributes['position'].value = Vector2.add(this.gameObject.transform.attributes['position'].value, this.attributes['velocity']);

                // decrease velocity according to friction
                let physicsFriction = this.gameObject.scene.project.physics.attributes['airResistance'].value;
                physicsFriction = Vector2.multiply(physicsFriction, this.attributes['frictionMultiplier'].value);

                this.attributes['velocity'] = Vector2.divide(this.attributes['velocity'], physicsFriction);

                // set velocity to zero if it's small enough
                if ((this.attributes['velocity'].x < 0.01) &&
                    (this.attributes['velocity'].x > -0.01)) {
                        this.attributes['velocity'].x = 0;
                }

                if ((this.attributes['velocity'].y < 0.01) &&
                    (this.attributes['velocity'].y > -0.01)) {
                        this.attributes['velocity'].y = 0;
                }
        }

        addForce(force) {
                this.attributes['velocity'] = Vector2.add(this.attributes['velocity'], force);
        }
}
