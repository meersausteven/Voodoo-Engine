
import { Vector2 } from './collection/vector2.js';

// import game objects
import { Talisman } from './talismans/talisman.js';

// import enchantments
import { Enchantment } from './enchantments/enchantment.js';
import { Animation } from './enchantments/animation.js';
import { Ocular } from './enchantments/ocular.js';
import { Rigidbody } from './enchantments/rigidbody.js';
import { Transform } from './enchantments/transform.js';

import { Renderer } from './enchantments/renderers/renderer.js';
import { BoxRenderer } from './enchantments/renderers/box_renderer.js';
import { CircleRenderer } from './enchantments/renderers/circle_renderer.js';
import { SpriteRenderer } from './enchantments/renderers/sprite_renderer.js';
import { TextRenderer } from './enchantments/renderers/text_renderer.js';
import { LineRenderer } from './enchantments/renderers/line_renderer.js';

import { Collider } from './enchantments/colliders/collider.js';
import { BoxCollider } from './enchantments/colliders/box_collider.js';
import { CircleCollider } from './enchantments/colliders/circle_collider.js';
import { CapsuleCollider } from './enchantments/colliders/capsule_collider.js';

// import attributes
import { AttributeBoolean } from './editor/attributes/attribute_boolean.js';
import { AttributeColor } from './editor/attributes/attribute_color.js';
import { AttributeHiddenText } from './editor/attributes/attribute_hidden_text.js';
import { AttributeImage } from './editor/attributes/attribute_image.js';
import { AttributeNumber } from './editor/attributes/attribute_number.js';
import { AttributeRange } from './editor/attributes/attribute_range.js';
import { AttributeText } from './editor/attributes/attribute_text.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';
import { AttributeSelect } from './editor/attributes/attribute_select.js';
import { AttributeArrayText } from './editor/attributes/attribute_array_text.js';
import { AttributeArrayNumber } from './editor/attributes/attribute_array_number.js';
import { AttributeArrayVector2 } from './editor/attributes/attribute_array_vector2.js';

// other classes
import { RendererEngine } from './renderer_engine.js';
import { Fizzle } from './fizzle.js';
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
        fizzle;

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
                // editor dom elements for game objects and their enchantments
                sceneListWrapper: '#scenes-container .container_content',
                talismanListWrapper: '#game-objects-container .container_content',
                enchantmentListWrapper: '#enchantments-container .container_content',
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
                        this.addScene(new Scene(this, 'Main Scene'));
                }

                // add renderer
                this.rendererEngine = new RendererEngine();

                // add physics
                this.fizzle = new Fizzle();

                // prepare canvas
                // this.prepareCanvas();
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
                        this.fizzle.calculateCollisions();

                        this.activeScene.processFixedUpdateFrame();
                }
        }

        prepareCanvas() {
                const editorCanvas = document.getElementById('editor-view');
                const playerCanvas = document.getElementById('player-view');

                if (editorCanvas !== null) {
                        this.canvas = editorCanvas;
                }

                if (playerCanvas !== null) {
                        this.canvas = playerCanvas;
                }

                this.canvas.width = this.settings.canvasWidth;
                this.canvas.height = this.settings.canvasHeight;

                this.canvasContext = this.canvas.getContext("2d");
                this.canvasContext.imageSmoothingEnabled = false;
        }

        addScene(scene) {
                scene.project = this;
                this.sceneList.push(scene);

                return true;
        }

        removeScene(scene) {
                const index = this.sceneList.indexOf(scene);
                this.sceneList.splice(index, 1);
        }

        // loads a scene in the project
        // @param Scene|number scene: scene instance or index of scene
        loadScene(scene) {
                // unload old scene
                if (this.activeScene !== null) {
                        this.activeScene.isCurrentScene = false;
                }

                // load new scene
                if (scene instanceof Scene) {
                        this.activeScene = scene;
                } else {
                        this.activeScene = this.sceneList[scene];
                }
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

                this.fizzleConversion(project.fizzle);

                let i = 0;
                const l = project.sceneList.length;
                while (i < l) {
                        project.sceneList[i].project = project;
                        this.sceneConversion(project.sceneList[i]);

                        ++i;
                }

                project.loadScene(project.settings['defaultScene']);

                return project;
        }

        fizzleConversion(fizzle) {
                fizzle = Object.setPrototypeOf(fizzle, Fizzle.prototype);

                return fizzle;
        }

        sceneConversion(scene) {
                scene = Object.setPrototypeOf(scene, Scene.prototype);

                // convert this scene's talismans
                for (const id in scene.talismans) {
                        const talisman = scene.talismans[id];

                        // convert this scene's talismans
                        talisman.scene = scene;
                        this.talismanConversion(talisman);
                }

                scene.getMainOcular();
        }

        talismanConversion(talisman) {
                talisman = Object.setPrototypeOf(talisman, Talisman.prototype);

                let i = 0;
                const l = talisman.enchantments.length;
                while (i < l) {
                        // convert this talisman's enchantments
                        talisman.enchantments[i].talisman = talisman;
                        this.enchantmentConversion(talisman.enchantments[i]);

                        ++i;
                }

                // get transform enchantment
                talisman.transform = talisman.getTransform();
        }

        enchantmentConversion(enchantment) {
                const instanceName = enchantment.type.replace(/\s/g, '');
                const prototype = eval(`new ${instanceName}`);

                enchantment = Object.setPrototypeOf(enchantment, Object.getPrototypeOf(prototype));

                if (enchantment instanceof Collider) {
                        enchantment.talisman.scene.project.fizzle.addCollider(enchantment);
                }

                if (enchantment instanceof Rigidbody) {
                        enchantment.talisman.scene.project.fizzle.addRigidbody(enchantment);
                }
        }

        /* JSON EXPORT */
        // turn this project object into a json object
        convertToJson() {
                this.projectPreCloningCleanup(this);

                const dummyProject = structuredClone(this);
                const json = JSON.stringify(dummyProject);

                this.projectPostCloningCleanup(this);

                return json;
        }

        // prepare project structure for json conversion
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

        // prepare scene structure for json conversion
        scenePreCloningCleanup(scene) {
                scene.project = null;

                for (const id in scene.talismans) {
                        const talisman = scene.talismans[id];

                        if (talisman instanceof Talisman) {
                                this.talismanPreCloningCleanup(talisman);
                        }
                }
        }

        // prepare talisman structure for json conversion
        talismanPreCloningCleanup(talisman) {
                talisman.scene = null;
                talisman.editorAttributes = {};

                let i = 0;
                const l = talisman.enchantments.length;
                while (i < l) {
                        this.enchantmentPreCloningCleanup(talisman.enchantments[i]);

                        ++i;
                }
        }

        // prepare enchantment structure for json conversion
        enchantmentPreCloningCleanup(enchantment) {
                if (enchantment.type === "Ocular") {
                        enchantment.canvas = null;
                        enchantment.canvasContext = null;
                }

                enchantment.talisman = null;
                enchantment.gizmos = [];
                enchantment.editorAttributes = {};
        }

        // restore project structure after cloning
        projectPostCloningCleanup(project) {
                project.prepareCanvas();

                let i = 0;
                const l = project.sceneList.length;
                while (i < l) {
                        project.sceneList[i].project = project;

                        this.scenePostCloningCleanup(project.sceneList[i]);

                        ++i;
                }
        }

        // restore scene structure after cloning
        scenePostCloningCleanup(scene) {
                for (const id in scene.talismans) {
                        const talisman = scene.talismans[id];

                        if (talisman instanceof Talisman) {
                                talisman.scene = scene;

                                this.talismanPostCloningCleanup(talisman);
                        }
                }
        }

        // restore talisman structure after cloning
        talismanPostCloningCleanup(talisman) {
                talisman.createAttributes();

                let i = 0;
                const l = talisman.enchantments.length;
                while (i < l) {
                        talisman.enchantments[i].talisman = talisman;

                        this.enchantmentPostCloningCleanup(talisman.enchantments[i]);

                        ++i;
                }
        }

        // restore enchantment structure after cloning
        enchantmentPostCloningCleanup(enchantment) {
                if (enchantment.type === "Ocular") {
                        enchantment.prepareCanvas();
                }

                enchantment.createAttributes();
                enchantment.updateGizmoData();
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
