
import { AttributeBoolean } from '../editor/attributes/attribute_boolean.js';

export class Component {
        type = "Component";
        gameObject = null;
        attributes = {};

        constructor() {
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);

                return;
        }

        start() {
                return;
        }

        update() {
                return;
        }

        fixedUpdate() {
                return;
        }

        lateUpdate() {
                return;
        }

        render() {
                return;
        }
}