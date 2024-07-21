
import { Vector2 } from '../collection/vector2.js';

import { Enchantment } from '../enchantments/enchantment.js';
import { Collider } from '../enchantments/colliders/collider.js';
import { BoxCollider } from '../enchantments/colliders/box_collider.js';
import { CircleCollider } from '../enchantments/colliders/circle_collider.js';
import { CapsuleCollider } from '../enchantments/colliders/capsule_collider.js';
import { Renderer } from '../enchantments/renderers/renderer.js';
import { BoxRenderer } from '../enchantments/renderers/box_renderer.js';
import { CircleRenderer } from '../enchantments/renderers/circle_renderer.js';
import { LineRenderer } from '../enchantments/renderers/line_renderer.js';
import { TextRenderer } from '../enchantments/renderers/text_renderer.js';
import { Transform } from '../enchantments/transform.js';
import { Ocular } from '../enchantments/ocular.js';
import { Rigidbody } from '../enchantments/rigidbody.js';

import { AttributeHiddenText } from '../editor/attributes/attribute_hidden_text.js';
import { AttributeBoolean } from '../editor/attributes/attribute_boolean.js';

export class Talisman {
        type = "Talisman";
        icon = "fa-cube";
        id = Math.randomID();
        editorAttributes = {};
        enchantments = [];
        transform = null;

        constructor(x = 0, y = 0, rotation = 0) {
                // every talisman is created with a transform enchantment
                const transform = new Transform(new Vector2(x, y), rotation);
                this.addEnchantment(transform);

                this.transform = transform;

                this.name = 'New Talisman';
                this.enabled = true;
                this.visible = true;

                this.createAttributes();
        }

        // start is called when the scene is started
        start() {
                let i = 0;
                const l = this.enchantments.length;

                while (i < l) {
                        this.enchantments[i].start();

                        ++i;
                }
        }

        // update is called every frame
        update() {
                let i = 0;
                const l = this.enchantments.length;

                while (i < l) {
                        if (this.enchantments[i].enabled === true) {
                                this.enchantments[i].update();
                        }

                        ++i;
                }
        }

        // fixed update is called in fixed intervals (default: 10ms)
        fixedUpdate() {
                let i = 0;
                const l = this.enchantments.length;

                while (i < l) {
                        if (this.enchantments[i].enabled === true) {
                                this.enchantments[i].fixedUpdate();
                        }

                        ++i;
                }
        }

        // late update is called after update()
        lateUpdate() {
                let i = 0;
                const l = this.enchantments.length;

                while (i < l) {
                        if (this.enchantments[i].enabled === true) {
                                this.enchantments[i].lateUpdate();
                        }

                        ++i;
                }
        }

        createAttributes() {
                this.editorAttributes['name'] = new AttributeHiddenText('Name', this.name, this.set.bind(this, 'name'), 'talisman_name_changed');
                this.editorAttributes['enabled'] = new AttributeBoolean('Enabled', this.enabled, this.set.bind(this, 'enabled'));
                this.editorAttributes['visible'] = new AttributeBoolean('Visible', this.visible, this.set.bind(this, 'visible'));
        }

        /*
         * adds a enchantment to this talisman
         * @param Enchantment enchantment: a enchantment
         */
        addEnchantment(enchantment) {
                enchantment.talisman = this;
                this.enchantments.push(enchantment);

                if (enchantment instanceof Collider) {
                        this.scene.project.fizzle.addCollider(enchantment);
                }

                if (enchantment instanceof Rigidbody) {
                        this.scene.project.fizzle.addRigidbody(enchantment);
                }
        }

        /*
         * removes a enchantment from this talisman
         * @param Number index: index of a enchantment that is to be removed
         */
        removeEnchantment(i) {
                const enchantment = this.enchantments[i];

                if (enchantment instanceof Collider) {
                        this.scene.project.fizzle.removeCollider(enchantment);
                }

                if (enchantment instanceof Rigidbody) {
                        this.scene.project.fizzle.removeRigidbody(enchantment);
                }

                this.enchantments.splice(i, 1);
        }

        /*
         * get the first enchantment of a given type
         * @param string type: type of the enchantment
         * @return: Enchantment | false
         */
        getEnchantment(name) {
                let i = 0;
                const l = this.enchantments.length;

                while (i < l) {
                        const proto = eval(name);

                        if (this.enchantments[i] instanceof proto) {
                                return this.enchantments[i];
                        }

                        ++i;
                }

                return false;
        }

        /*
         * get the transform enchantment of this talisman
         * @return: Transform
         */
        getTransform() {
                return this.getEnchantment('Transform');
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