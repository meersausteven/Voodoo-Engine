
import { GameObject } from './game_objects/game_object.js';

import { Camera } from './components/camera.js';

import { AttributeHiddenText } from './editor/attributes/attribute_hidden_text.js';

export class Scene {
        project;
        gameObjects = [];
        attributes = {};
        isCurrentScene = false;
        activeCamera = null;

        constructor(project) {
                this.project = project;

                this.attributes['name'] = new AttributeHiddenText('Name', 'New Scene');

                // add default main camera
                this.addGameObject(new GameObject());
                this.gameObjects[0].attributes['name'].startValue = "Main Camera";
                this.gameObjects[0].attributes['name'].value = "Main Camera";
                // add camera component to default main camera
                this.gameObjects[0].addComponent(
                        new Camera(this.project.settings['canvasWidth'], this.project.settings['canvasHeight'])
                );
        }

        start() {
                //start all game objects
                let i = 0;
                const l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].start();
                        }

                        ++i;
                }

                // get default camera component
                this.activeCamera = this.getMainCamera();
        }

        processUpdateFrame() {
                // process all enabled gameObjects
                let i = 0;
                const l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].update();
                                this.gameObjects[i].lateUpdate();
                        }

                        ++i;
                }

                // get active camera view
                this.project.canvasContext.clearRect(0, 0, this.project.canvas.width, this.project.canvas.height);

                this.project.canvasContext.drawImage(this.activeCamera.frameImage, 0, 0);
        }

        processFixedUpdateFrame() {
                // process all enabled gameObjects
                let i = 0;
                const l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].fixedUpdate();
                        }

                        ++i;
                }
        }

        addGameObject(gameObject) {
                gameObject.scene = this;
                this.gameObjects.push(gameObject);

                window.dispatchEvent(new Event('game_object_list_changed'));
        }

        removeGameobject(gameObject) {
                const index = this.gameObjects.indexOf(gameObject);
                this.gameObjects.splice(index, 1);

                window.dispatchEvent(new Event('game_object_list_changed'));
        }

        // get main camera in this scene
        getMainCamera() {
                let i = 0;
                const l = this.gameObjects.length;

                while (i < l) {
                        const component = this.gameObjects[i].getComponent("Camera");

                        if (component !== false) {
                                return component;
                        }

                        ++i;
                }

                return null;
        }
}