
import { AttributeText } from '../editor/attributes/attribute_text.js';
import { AttributeBoolean } from '../editor/attributes/attribute_boolean.js';

import { HtmlElement } from '../editor/html_helpers/html_element.js';

export class Enchantment {
        type = "Enchantment";
        icon = "fa-solid fa-wand-sparkles";
        talisman = null;
        attributes = {};

        constructor() {
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
        }

        // called when initializing
        start() {
                return;
        }

        // called every frame
        update() {
                return;
        }

        // called in a certain interval
        fixedUpdate() {
                return;
        }

        // called after the update method
        lateUpdate() {
                return;
        }

        renderGizmo(ocular) {
                return;
        }

        // return all attributes to its start values
        resetAttributes() {
                for (let key in this.attributes) {
                        if (key !== "enabled") {
                                this.attributes[key].reset();
                        }
                }
        }
}