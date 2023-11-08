
import { Vector2 } from './collection/vector2.js';

// import game objects
import { GameObject } from './game_objects/game_object.js';

// import components
import { Component } from './components/component.js';
import { Animation } from './components/animation.js';
import { Camera } from './components/camera.js';
import { Rigidbody } from './components/rigidbody.js';
import { Transform } from './components/transform.js';

import { Renderer } from './components/renderers/renderer.js';
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
import { RendererEngine } from './renderer_engine.js';
import { PhysicsEngine } from './physics_engine.js';
import { Scene } from './scene.js';
import { Time } from './time.js';

window.time = new Time();

export class Project {
        // canvas
        canvas;
        canvasContext;

        // scenes
        sceneList = [];
        activeScene = null;

        // renderer
        rendererEngine;

        // physics
        physicsEngine;

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
                // editor dom elements for game objects and their components
                sceneListWrapper: '#scenes-container .container_content',
                gameObjectListWrapper: '#game-objects-container .container_content',
                componentListWrapper: '#components-container .container_content',
                // file paths
                filePathSprites: window.location.href + "/../assets/sprites/",
                filePathAudio: window.location.href + "/../assets/audio/",
        };

        // update cycles
        paused = false;
        animationFrame = null;
        fixedUpdate = null;

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
                this.rendererEngine = new RendererEngine();

                // add physics
                this.physicsEngine = new PhysicsEngine();

                // prepare canvas
                this.prepareCanvas();
        }

        // start the simulation
        start() {
                this.prepareCanvas();
                this.canvas.style.backgroundColor = this.settings['canvasBackgroundColor'];

                // add event listeners for input
                this.addInputListeners();

                // add a new rendererEngine if none is given
                if (this.rendererEngine === null) {
                        this.rendererEngine = new RendererEngine();
                }

                // start first scene if no active scene is given
                if (this.activeScene === null) {
                        this.loadScene(this.settings['defaultScene']);
                }

                window.focus();
                this.fixedUpdate = setInterval(this.processFixedUpdateFrame.bind(this), this.settings.fixedUpdateInterval);
                this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));
        }

        resume() {
                this.paused = false;
                window.time.lastFrame = performance.now() / 1000;

                this.fixedUpdate = setInterval(this.processFixedUpdateFrame.bind(this), this.settings.fixedUpdateInterval);
                this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));
        }

        pause() {
                this.paused = true;

                clearInterval(this.fixedUpdate);
                window.cancelAnimationFrame(this.animationFrame);
        }

        // completely stop the simulation
        stop() {
                this.removeInputListeners();
                this.pause();
        }

        // process regular update frame of scene
        processFrame(currentTime) {
                window.time.update(currentTime);

                if ((this.paused == false) && (this.activeScene !== null)) {
                        this.activeScene.processUpdateFrame();

                        this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));
                }
        }

        // process fixed update frame of scene
        processFixedUpdateFrame() {
                if ((this.paused == false) && (this.activeScene !== null)) {
                        // always calculate the physics before anything else
                        this.physicsEngine.calculateCollisions();

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
                if (scene.project === null) {
                        scene.project = this;
                }

                this.sceneList.push(scene);

                return true;
        }

        removeScene(scene) {
                const index = this.sceneList.indexOf(scene);
                this.sceneList.splice(index, 1);

                dispatchEvent(new Event('scene_list_changed'));
        }

        loadScene(index) {
                // unload old scene
                if (this.activeScene !== null) {
                        this.activeScene.isCurrentScene = false;
                }

                // load new scene
                this.activeScene = this.sceneList[index];
                this.activeScene.isCurrentScene = true;
                this.activeScene.start();
        }

        getSceneIndex(scene) {
                const index = this.sceneList.indexOf(scene);

                return index;
        }

        getActiveSceneIndex() {
                const index = this.sceneList.indexOf(this.activeScene);

                return index;
        }

        /* JSON IMPORT */
        // turn a passed json object into a project object
        convertToProject(json) {
                const jsonProject = JSON.parse(json);
                const convertedProject = this.projectConversion(jsonProject);

                return convertedProject;
        }

        projectConversion(project) {
                project = Object.setPrototypeOf(project, Project.prototype);

                project.rendererEngine = Object.setPrototypeOf(project.rendererEngine, RendererEngine.prototype);

                this.physicsConversion(project.physicsEngine);

                let i = 0;
                const l = project.sceneList.length;

                while (i < l) {
                        project.sceneList[i].project = project;
                        this.sceneConversion(project.sceneList[i]);

                        ++i;
                }

                return project;
        }

        physicsConversion(physics) {
                physics = Object.setPrototypeOf(physics, PhysicsEngine.prototype);

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
                const l = scene.gameObjects.length;

                while (i < l) {
                        // convert this scene's gameObjects
                        scene.gameObjects[i].scene = scene;
                        this.gameObjectConversion(scene.gameObjects[i]);

                        ++i;
                }
        }

        gameObjectConversion(gameObject) {
                gameObject = Object.setPrototypeOf(gameObject, GameObject.prototype);

                // convert this gameObject's attributes
                for (let key in gameObject.attributes) {
                        this.attributeConversion(gameObject.attributes[key]);
                }

                let i = 0;
                const l = gameObject.components.length;

                while (i < l) {
                        // convert this gameObject's components
                        gameObject.components[i].gameObject = gameObject;
                        this.componentConversion(gameObject.components[i]);

                        ++i;
                }

                // get transform component
                gameObject.transform = gameObject.getTransform();
        }

        componentConversion(component) {
                const instanceName = component.type.replace(/\s/g, '');
                const prototype = eval(`new ${instanceName}`);

                component = Object.setPrototypeOf(component, Object.getPrototypeOf(prototype));

                if (component instanceof Collider) {
                        component.gameObject.scene.project.physicsEngine.addCollider(component);
                }

                if (component instanceof Rigidbody) {
                        component.gameObject.scene.project.physicsEngine.addRigidbody(component);
                }

                // convert this component's attributes
                for (let key in component.attributes) {
                        this.attributeConversion(component.attributes[key]);
                }
        }

        attributeConversion(attribute) {
                const instanceName = attribute.type.replace(/\s/g, '');
                const prototype = eval(`new ${instanceName}`);

                attribute = Object.setPrototypeOf(attribute, Object.getPrototypeOf(prototype));

                if (instanceName === 'AttributeVector2') {
                        attribute.value = Object.setPrototypeOf(attribute.value, Vector2.prototype);
                        attribute.startValue = Object.setPrototypeOf(attribute.startValue, Vector2.prototype);
                }
        }

        /* JSON EXPORT */
        // turn this project object into a json object
        convertToJson() {
                this.projectPreCloningCleanup(this);

                const dummyProject = structuredClone(this);
                this.projectPostCloningCleanup(dummyProject);
                const json = JSON.stringify(dummyProject);

                return json;
        }

        // remove cyclic project values
        projectPostCloningCleanup(project) {
                project.canvas = null;

                let i = 0;
                const l = project.sceneList.length;

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
                const l = scene.gameObjects.length;

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
                const l = gameObject.components.length;

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
                const l = project.sceneList.length;

                while (i < l) {
                        this.scenePreCloningCleanup(project.sceneList[i]);

                        ++i;
                }

                return project;
        }

        scenePreCloningCleanup(scene) {
                let i = 0;
                const l = scene.gameObjects.length;

                while (i < l) {
                        this.gameObjectPreCloningCleanup(scene.gameObjects[i]);

                        ++i;
                }

                return scene;
        }

        gameObjectPreCloningCleanup(gameObject) {
                let i = 0;
                const l = gameObject.components.length;

                while (i < l) {
                        this.componentPreCloningCleanup(gameObject.components[i]);

                        ++i;
                }

                return gameObject;
        }

        componentPreCloningCleanup(component) {
                if (component.type === "Camera") {
                        component.canvas = null;
                        component.canvasContext = null;
                }

                return component;
        }

        /* INPUT HANDLING */
        addInputListeners() {
                window.addEventListener("focus", this);
                window.addEventListener("blur", this);
                document.addEventListener("keydown", this);
                document.addEventListener("keyup", this);
                this.canvas.addEventListener("mousedown", this);
                this.canvas.addEventListener("mouseup", this);
                this.canvas.addEventListener("mousemove", this);
        }

        removeInputListeners() {
                window.removeEventListener("focus", this);
                window.removeEventListener("blur", this);
                document.removeEventListener("keydown", this);
                document.removeEventListener("keyup", this);
                this.canvas.removeEventListener("mousedown", this);
                this.canvas.removeEventListener("mouseup", this);
                this.canvas.removeEventListener("mousemove", this);
        }

        handleEvent(e) {
                const eventLookup = {
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
                        focus: function(e) {
                                this.onFocus(e);
                        }.bind(this),
                        blur: function(e) {
                                this.onBlur(e);
                        }.bind(this),
                        default: function(e) {
                                console.warn(`Unexpected event: ${e.type}`);
                        }.bind(this)
                };

                return (eventLookup[e.type] || eventLookup['default'])(e);
        }

        onFocus(e) {
                this.resume();
        }

        onBlur(e) {
                this.pause();
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
