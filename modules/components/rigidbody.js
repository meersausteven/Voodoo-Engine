
import { Vector2 } from './../collection/vector2.js';

import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';

import { Component } from './component.js';

export class Rigidbody extends Component {
        type = "Rigidbody";

        constructor() {
                super();

                this.attributes['obeyGravity'] = new AttributeBoolean('Obey Gravity', true);
                this.attributes['gravityScale'] = new AttributeNumber('Gravity Scale', 1);
                this.attributes['mass'] = new AttributeNumber('Mass', 1);
                this.attributes['velocity'] = new Vector2();
                this.attributes['friction'] = new AttributeNumber('Friction', 0);
                this.attributes['canCollide'] = new AttributeBoolean('Can Collide', true);
        }

        update() {
                // velocity stuff
                this.gameObject.components[0].attributes['position'].value.x += this.attributes['velocity'].x * time.deltaTime;
                this.gameObject.components[0].attributes['position'].value.y += this.attributes['velocity'].y * time.deltaTime;

                this.attributes['velocity'].x *= (1 - this.attributes['friction'].value);
                this.attributes['velocity'].y *= (1 - this.attributes['friction'].value);

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
