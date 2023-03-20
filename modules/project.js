
import { Vector2 } from './collection/vector2.js';

// import game objects
import { GameObject } from './game_objects/game_object.js';

// import components
import { Component } from './components/component.js';
import { Animation } from './components/animation.js';
import { Camera } from './components/camera.js';
import { Rigidbody } from './components/rigidbody.js';
import { Transform } from './components/transform.js';

import { ComponentRenderer } from './components/renderers/component_renderer.js';
import { BoxRenderer } from './components/renderers/box_renderer.js';
import { CircleRenderer } from './components/renderers/circle_renderer.js';
import { SpriteRenderer } from './components/renderers/sprite_renderer.js';
import { TextRenderer } from './components/renderers/text_renderer.js';
import { LineRenderer } from './components/renderers/line_renderer.js';

import { Collider } from './components/colliders/collider.js';
import { BoxCollider } from './components/colliders/box_collider.js';
import { CircleCollider } from './components/colliders/circle_collider.js';
import { CapsuleCollider } from './components/colliders/capsule_collider.js';

// import attributes
import { AttributeBoolean } from './editor/attributes/attribute_boolean.js';
import { AttributeColor } from './editor/attributes/attribute_color.js';
import { AttributeHiddenText } from './editor/attributes/attribute_hidden_text.js';
import { AttributeImage } from './editor/attributes/attribute_image.js';
import { AttributeNumber } from './editor/attributes/attribute_number.js';
import { AttributeText } from './editor/attributes/attribute_text.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';
import { AttributeSelect } from './editor/attributes/attribute_select.js';
import { AttributeArrayText } from './editor/attributes/attribute_array_text.js';
import { AttributeArrayNumber } from './editor/attributes/attribute_array_number.js';
import { AttributeArrayVector2 } from './editor/attributes/attribute_array_vector2.js';

// other classes
import { Renderer } from './renderer.js';
import { Physics } from './physics.js';

import { Scene } from './scene.js';

import { Time } from './time.js';

const time = new Time();

export class Project {
        // canvas
        canvas;
        canvasContext;

        // scenes
        sceneList = [];
        activeScene;

        // renderer
        renderer;

        // physics
        physics;

        // settings
        settings = {
                // name of the project
                projectName: 'New Project',
                // index of the scene in sceneList which will be loaded when the project starts
                defaultScene: 0,
                // canvas
                canvasSelector: '#gameArea',
                canvasWidth: 1280,
                canvasHeight: 720,
                canvasBackgroundColor: '#0e0f1f',
                canvasHideCursor: false,
                // fixed update interval in ms
                fixedUpdateInterval: 10,
                // rendering
                renderByYPosition: false,
                // editor dom elements for game objects and their components
                sceneListWrapper: '#scenes-container .container_content',
                gameObjectListWrapper: '#game-objects-container .container_content',
                componentListWrapper: '#components-container .container_content',
                // file paths
                filePathSprites: window.location.href + "/../assets/sprites/",
                filePathAudio: window.location.href + "/../assets/audio/",
        };

        // update cycles
        animationFrame;
        fixedUpdate;

        // input manager
        input = {
                keys: [],
                mouse: {
                        buttons: [],
                        pos: new Vector2()
                }
        };

        constructor() {
                // add new scene
                if (this.sceneList.length == 0) {
                        this.addScene(new Scene(this));
                }

                // add renderer
                this.renderer = new Renderer();

                // add physics
                this.physics = new Physics();

                // prepare canvas
                this.prepareCanvas();
        }

        start() {
                this.prepareCanvas();
                this.canvas.style.backgroundColor = this.settings['canvasBackgroundColor'];

                // add event listeners for input
                this.addInputListeners();

                // add a new renderer if none is given
                if (this.renderer === null) {
                        this.renderer = new Renderer();
                }

                // start first scene if no active scene is given
                if ((this.activeScene === null) ||
                    (typeof this.activeScene === 'undefined')
                ) {
                        this.loadScene(this.settings['defaultScene']);
                }

                // start update cycles
                this.fixedUpdate = setInterval(this.processFixedUpdateFrame.bind(this), this.settings.fixedUpdateInterval);
                this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));
        }

        stop() {
                this.removeInputListeners();

                clearInterval(this.fixedUpdate);
                window.cancelAnimationFrame(this.animationFrame);
        }

        processFrame(currentTime) {
                // track time
                time.update(currentTime);

                // process update frame in scene
                if ((this.activeScene !== null) &&
                    (typeof this.activeScene !== 'undefined')
                ) {
                        this.activeScene.processUpdateFrame();
                }

                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        processFixedUpdateFrame() {
                // process fixed update frame in scene
                if ((this.activeScene !== null) &&
                    (typeof this.activeScene !== 'undefined')
                ) {
                        this.activeScene.processFixedUpdateFrame();
                }
        }

        prepareCanvas() {
                this.canvas = document.querySelector(this.settings.canvasSelector);

                this.canvas.width = this.settings.canvasWidth;
                this.canvas.height = this.settings.canvasHeight;

                this.canvasContext = this.canvas.getContext("2d");
                this.canvasContext.imageSmoothingEnabled = false;
        }

        addScene(scene) {
                if (scene instanceof Scene) {
                        if (scene.project === null) {
                                scene.project = this;
                        }

                        this.sceneList.push(scene);

                        return true;
                }
        }

        removeScene(index) {
                if ((typeof index == "number") &&
                    ((this.sceneList[index] !== null) &&
                     (typeof this.sceneList[index] !== 'undefined'))
                ) {
                        this.sceneList[index] = null;

                        dispatchEvent(new Event('scene_list_changed'));
                }
        }

        loadScene(index) {
                if ((typeof this.sceneList[index] !== 'undefined') &&
                    (this.sceneList[index] !== null)
                ) {
                        // unload old scene
                        if ((typeof this.activeScene !== 'undefined') && 
                            (this.activeScene !== null)
                        ) {
                                this.activeScene.isCurrentScene = false;
                        }

                        // load new scene
                        this.activeScene = this.sceneList[index];
                        this.activeScene.isCurrentScene = true;
                        this.activeScene.start();
                }
        }

        getSceneIndex(scene) {
                if (!(scene instanceof Scene)) {
                        let i = 0;
                        let l = this.sceneList.length;

                        while (i < l) {
                                if (this.sceneList[i] === scene) {
                                        return i;
                                }

                                ++i;
                        }
                }
        }

        getActiveSceneIndex() {
                for (let i = 0; i < this.sceneList.length; i++) {
                        if (this.activeScene === this.sceneList[i]) {
                                return i;
                        }
                }

                console.warn("ERROR: active scene not found in sceneList");
        }

        /* JSON IMPORT */
        // turn a passed json object into a project object
        convertToProject(json) {
                let jsonProject = JSON.parse(json);

                let convertedProject = this.projectConversion(jsonProject);

                return convertedProject;
        }

        projectConversion(project) {
                project = Object.setPrototypeOf(project, Project.prototype);

                project.renderer = Object.setPrototypeOf(project.renderer, Renderer.prototype);

                this.physicsConversion(project.physics);

                let i = 0;
                let l = project.sceneList.length;
                while (i < l) {
                        project.sceneList[i].project = project;
                        this.sceneConversion(project.sceneList[i]);

                        ++i;
                }

                return project;
        }

        physicsConversion(physics) {
                physics = Object.setPrototypeOf(physics, Physics.prototype);

                // convert this physics' attributes
                for (let key in physics.attributes) {
                        this.attributeConversion(physics.attributes[key]);
                }
        }

        sceneConversion(scene) {
                scene = Object.setPrototypeOf(scene, Scene.prototype);

                // convert this scene's attributes
                for (let key in scene.attributes) {
                        this.attributeConversion(scene.attributes[key]);
                }

                let i = 0;
                let l = scene.gameObjects.length;
                while (i < l) {
                        // convert this scene's gameObjects
                        scene.gameObjects[i].scene = scene;
                        this.gameObjectConversion(scene.gameObjects[i]);

                        ++i;
                }

                return scene;
        }

        gameObjectConversion(gameObject) {
                gameObject = Object.setPrototypeOf(gameObject, GameObject.prototype);

                // convert this gameObject's attributes
                for (let key in gameObject.attributes) {
                        this.attributeConversion(gameObject.attributes[key]);
                }

                let i = 0;
                let l = gameObject.components.length;
                while (i < l) {
                        // convert this gameObject's components
                        gameObject.components[i].gameObject = gameObject;
                        this.componentConversion(gameObject.components[i]);

                        ++i;
                }

                // get transform component
                gameObject.transform = gameObject.getTransform();

                return gameObject;
        }

        componentConversion(component) {
                let instanceName = component.type.replace(/\s/g, '');
                let prototype = eval(`new ${instanceName}`);

                component = Object.setPrototypeOf(component, Object.getPrototypeOf(prototype));

                // convert this component's attributes
                for (let key in component.attributes) {
                        this.attributeConversion(component.attributes[key]);
                }

                return component;
        }

        attributeConversion(attribute) {
                let instanceName = attribute.type.replace(/\s/g, '');
                let prototype = eval(`new ${instanceName}`);

                attribute = Object.setPrototypeOf(attribute, Object.getPrototypeOf(prototype));

                if (instanceName == 'AttributeVector2') {
                        attribute.value = Object.setPrototypeOf(attribute.value, Vector2.prototype);
                        attribute.startValue = Object.setPrototypeOf(attribute.startValue, Vector2.prototype);
                }

                return attribute;
        }

        /* JSON EXPORT */
        // turn this project object into a json object
        convertToJson() {
                this.projectPreCloningCleanup(this);

                let dummyProject = structuredClone(this);

                this.projectPostCloningCleanup(dummyProject);

                let json = JSON.stringify(dummyProject);

                return json;
        }

        // remove cyclic project values
        projectPostCloningCleanup(project) {
                project.canvas = null;

                let i = 0;
                let l = project.sceneList.length;
                while (i < l) {
                        this.scenePostCloningCleanup(project.sceneList[i]);

                        ++i;
                }

                return project;
        }

        // remove cyclic scene values
        scenePostCloningCleanup(scene) {
                scene.project = null;

                let i = 0;
                let l = scene.gameObjects.length;
                while (i < l) {
                        this.gameObjectPostCloningCleanup(scene.gameObjects[i]);

                        ++i;
                }

                return scene;
        }

        // remove cyclic gameObject values
        gameObjectPostCloningCleanup(gameObject) {
                gameObject.scene = null;

                let i = 0;
                let l = gameObject.components.length;
                while (i < l) {
                        this.componentPostCloningCleanup(gameObject.components[i]);

                        ++i;
                }

                return gameObject;
        }

        // remove cyclic component values
        componentPostCloningCleanup(component) {
                component.gameObject = null;

                for (let key in component.attributes) {
                        component.attributes[key].component = null;
                }

                return component;
        }

        projectPreCloningCleanup(project) {
                project.canvas = null;
                project.canvasContext = null;

                let i = 0;
                let l = project.sceneList.length;
                while (i < l) {
                        this.scenePreCloningCleanup(project.sceneList[i]);

                        ++i;
                }

                return project;
        }

        scenePreCloningCleanup(scene) {
                let i = 0;
                let l = scene.gameObjects.length;
                while (i < l) {
                        this.gameObjectPreCloningCleanup(scene.gameObjects[i]);

                        ++i;
                }

                return scene;
        }

        gameObjectPreCloningCleanup(gameObject) {
                let i = 0;
                let l = gameObject.components.length;
                while (i < l) {
                        this.componentPreCloningCleanup(gameObject.components[i]);

                        ++i;
                }

                return gameObject;
        }

        componentPreCloningCleanup(component) {
                if (component.type === 'Camera') {
                        component.canvas = null;
                        component.canvasContext = null;
                }

                return component;
        }

        /* INPUT HANDLING */
        addInputListeners() {
                document.addEventListener("keydown", this);
                document.addEventListener("keyup", this);
                this.canvas.addEventListener("mousedown", this);
                this.canvas.addEventListener("mouseup", this);
                this.canvas.addEventListener("mousemove", this);
        }

        removeInputListeners() {
                document.removeEventListener("keydown", this);
                document.removeEventListener("keyup", this);
                this.canvas.removeEventListener("mousedown", this);
                this.canvas.removeEventListener("mouseup", this);
                this.canvas.removeEventListener("mousemove", this);
        }

        handleEvent(e) {
                let eventLookup = {
                        mousedown: function(e) {
                                this.onMouseDown(e);
                        }.bind(this),
                        mouseup: function(e) {
                                this.onMouseUp(e);
                        }.bind(this),
                        mousemove: function(e) {
                                this.onMouseMove(e);
                        }.bind(this),
                        keydown: function(e) {
                                this.onKeyDown(e);
                        }.bind(this),
                        keyup: function(e) {
                                this.onKeyUp(e);
                        }.bind(this),
                        default: function(e) {
                                console.warn(`Unexpected event: ${e.type}`);
                        }.bind(this)
                };

                return (eventLookup[e.type] || eventLookup['default'])(e);
        }

        onKeyDown(e) {
                if (e.repeat) {
                        return;
                }

                this.input.keys.push(e.code);
                this.input.keys.clear();
        }

        onKeyUp(e) {
                this.input.keys.remove(e.code);
        }

        onMouseDown(e) {
                this.input.mouse.buttons.push(e.buttons);
                this.input.mouse.buttons.clear();
        }

        onMouseUp(e) {
                this.input.mouse.buttons.remove(e.buttons);
        }

        onMouseMove(e) {
                this.input.mouse.pos = new Vector2(e.clientX, e.clientY);
        }
}
