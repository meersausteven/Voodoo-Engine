
import { Vector2 } from '../collection/vector2.js';

import { Component } from '../components/component.js';
import { Collider } from '../components/colliders/collider.js';
import { BoxCollider } from '../components/colliders/box_collider.js';
import { CircleCollider } from '../components/colliders/circle_collider.js';
import { CapsuleCollider } from '../components/colliders/capsule_collider.js';
import { Renderer } from '../components/renderers/renderer.js';
import { BoxRenderer } from '../components/renderers/box_renderer.js';
import { CircleRenderer } from '../components/renderers/circle_renderer.js';
import { LineRenderer } from '../components/renderers/line_renderer.js';
import { TextRenderer } from '../components/renderers/text_renderer.js';
import { Transform } from '../components/transform.js';
import { Camera } from '../components/camera.js';
import { Rigidbody } from '../components/rigidbody.js';

import { AttributeHiddenText } from '../editor/attributes/attribute_hidden_text.js';
import { AttributeBoolean } from '../editor/attributes/attribute_boolean.js';

export class GameObject {
        type = "Game Object";
        attributes = {};
        components = [];
        transform = null;

        constructor(x = 0, y = 0, rotation = 0) {
                // every game object is created with a transform component
                const transform = new Transform(new Vector2(x, y), rotation);
                this.addComponent(transform);

                this.transform = transform;

                this.attributes['name'] = new AttributeHiddenText('Name', 'New GameObject', 'current_gameObject_name_changed');
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
        }

        // start is called when the scene is started
        start() {
                let i = 0;
                const l = this.components.length;

                while (i < l) {
                        this.components[i].start();

                        ++i;
                }
        }

        // update is called every frame
        update() {
                let i = 0;
                const l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].update();
                        }

                        ++i;
                }
        }

        // fixed update is called in fixed intervals (default: 10ms)
        fixedUpdate() {
                let i = 0;
                const l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].fixedUpdate();
                        }

                        ++i;
                }
        }

        // late update is called after update()
        lateUpdate() {
                let i = 0;
                const l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].lateUpdate();
                        }

                        ++i;
                }
        }

        /*
         * adds a component to this gameObject
         * @param Component component: a component
         */
        addComponent(component) {
                component.gameObject = this;
                this.components.push(component);

                if (component instanceof Collider) {
                        this.scene.project.physicsEngine.addCollider(component);
                }

                if (component instanceof Rigidbody) {
                        this.scene.project.physicsEngine.addRigidbody(component);
                }
        }

        /*
         * removes a component from this gameObject
         * @param Component component: a component that is to be removed
         */
        removeComponent(i) {
                const component = this.components[i];

                if (component instanceof Collider) {
                        this.scene.project.physicsEngine.removeCollider(component);
                }

                if (component instanceof Rigidbody) {
                        this.scene.project.physicsEngine.removeRigidbody(component);
                }

                this.components.splice(i, 1);
        }

        /*
         * get the first component of a given type
         * @param string type: type of the component
         * @return: Component | false
         */
        getComponent(name) {
                let i = 0;
                const l = this.components.length;

                while (i < l) {
                        const proto = eval(name);

                        if (this.components[i] instanceof proto) {
                                return this.components[i];
                        }

                        ++i;
                }

                return false;
        }

        /*
         * get the transform component of this gameObject
         * @return: Transform
         */
        getTransform() {
                let i = 0;
                const l = this.components.length;

                while (i < l) {
                        if (this.components[i] instanceof Transform) {
                                return this.components[i];
                        }

                        ++i;
                }
        }
}