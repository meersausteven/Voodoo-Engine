
import { AttributeText } from '../editor/attributes/attribute_text.js';
import { AttributeBoolean } from '../editor/attributes/attribute_boolean.js';

import { HtmlElement } from '../editor/html_helpers/html_element.js';

export class Enchantment {
        type = "Enchantment";
        icon = "fa-solid fa-wand-sparkles";
        talisman = null;
        editorAttributes = {};

        constructor() {
                this.enabled = true;
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

        createAttributes() {
                return;
        }

        // return all attributes to its start values
        resetAttributes() {
                for (let key in this.editorAttributes) {
                        this.editorAttributes[key].reset();
                }
        }

        // update editor gizmo data
        updateGizmoData() {
                return;
        }

        // set the value of an attribute
        set(attribute, value) {
                this[attribute] = value;
        }

        // get the value of an attribute
        get(attribute) {
                return this[attribute];
        }
}