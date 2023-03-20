
import { Vector2 } from '../collection/vector2.js';

import { Component } from '../components/component.js';
import { Transform } from '../components/transform.js';

import { AttributeHiddenText } from '../editor/attributes/attribute_hidden_text.js';
import { AttributeBoolean } from '../editor/attributes/attribute_boolean.js';

export class GameObject {
        type = "Game Object";
        components = [];
        attributes = {};

        constructor(x = 0, y = 0, rotation = 0) {
                // every game object is created with a transform component
                let transform = new Transform(new Vector2(x, y), rotation);
                this.addComponent(transform);

                this.transform = transform;

                this.attributes['name'] = new AttributeHiddenText('Name', 'New GameObject', 'current_gameObject_name_changed');
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
        }

        start() {
                // start all components
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].start();

                        ++i;
                }
        }

        update() {
                // update is called every frame
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].update();
                        }

                        ++i;
                }
        }

        fixedUpdate() {
                // fixed update is called in a certain interval (default: 10ms)
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].fixedUpdate();
                        }

                        ++i;
                }
        }

        lateUpdate() {
                // late update is called after update()
                let i = 0;
                let l = this.components.length;

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
                if (component instanceof Component) {
                        component.gameObject = this;
                        this.components.push(component);
                }

                new TypeError('Component could not be added as it is not an instance of the Component class');
        }

        /*
         * removes a component from this gameObject
         * @param Component component: a component that is to be removed
         */
        removeComponent(component) {
                if (component instanceof Component) {
                        let i = 0;
                        let l = this.components.length;

                        while (i < l) {
                                if (this.components[i] === component) {
                                        this.components.splice(i, 1);
                                }

                                ++i;
                        }

                        new Error('Component could not be removed as it is not part of this gameObject');
                }
        }

        /*
         * get the first component of a given type
         * @param string type: type of the component
         * @return: Component | false
         */
        getComponent(name) {
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i].type === name) {
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
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i] instanceof Transform) {
                                return this.components[i];
                        }

                        ++i;
                }

                new Error('This gameObject does not contain a transform component');
        }
}