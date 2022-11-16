
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
                this.attributes['gravityScale'] = new AttributeNumber('Gravity Scale', 1);
                this.attributes['frictionScale'] = new AttributeNumber('Friction Scale', 1);
        }

        update() {
                // increase velocity according to gravity
                let physicsGravity = new Vector2(this.gameObject.scene.project.physics.attributes['gravity'].value.x, this.gameObject.scene.project.physics.attributes['gravity'].value.y);
                physicsGravity.multiply(time.deltaTime);

                if (this.attributes['obeyGravity'].value === true) {
                        this.attributes['velocity'].add(physicsGravity);
                }

                // apply velocity to gameObject
                this.gameObject.transform.attributes['position'].value.add(this.attributes['velocity']);

                // decrease velocity according to friction
                let physicsFriction = this.gameObject.scene.project.physics.attributes['friction'].value;
                physicsFriction.multiply(this.attributes['frictionScale'].value);

                this.attributes['velocity'].multiply(physicsFriction);

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
                this.attributes['velocity'].add(force);
        }
}
