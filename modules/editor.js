
// import base modules
import { Project } from './project.js';
import { Scene } from './scene.js';
import { RendererEngine } from './renderer_engine.js';
import { Cursor } from './cursor.js';

// import game objects
import { GameObject } from './game_objects/game_object.js';

// import collection
import { Vector2 } from './collection/vector2.js';
import { Range } from './collection/range.js';

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

// import html_helpers
import { HtmlElement } from './editor/html_helpers/html_element.js';
import { Popup } from './editor/html_helpers/popup.js';
import { Snackbar } from './editor/html_helpers/snackbar.js';
import { SNACKBAR_NEUTRAL, SNACKBAR_WARNING, SNACKBAR_DANGER, SNACKBAR_SUCCESS } from './editor/html_helpers/snackbar.js';
import { Tabbar } from './editor/html_helpers/tabbar.js';
import { TABBAR_POSITION_START, TABBAR_POSITION_CENTER, TABBAR_POSITION_END} from './editor/html_helpers/tabbar.js';
import { TabbarTab } from './editor/html_helpers/tabbar_tab.js';

export class Editor {
        // project
        project;
        // current scene
        currentScene;
        // currently selected game object
        currentGameObject;
        currentGameObjectHTML;
        // currently selected component
        currentGizmo = null;
        // renderer
        renderer;
        // canvas
        canvas;
        canvasContext;
        // canvas zoom
        canvasZoom;
        // camera
        camera;
        // add new game object options
        availableGameObjects = [
                'Game Object'
        ];
        // add new component options
        availableComponents = {
                Renderers: [
                        'Box Renderer',
                        'Circle Renderer',
                        //'Sprite Renderer',
                        'Text Renderer',
                        'Line Renderer',
                ],
                Colliders: [
                        'Box Collider',
                        'Circle Collider',
                        'Capsule Collider',
                ],
                Others: [
                        'Camera',
                        'Rigidbody',
                        //'Animation'
                ]
        };
        // settings
        settings = {
                'tabbarSelector': new AttributeText('Tabbar Selector', '#editor-tabbar'),
                'canvasSelector': new AttributeText('Canvas Selector', '#gameArea'),
                'displayGrid': new AttributeBoolean('Display Grid', true),
                'gridSize': new AttributeVector2('Grid Size', new Vector2(100, 100)),
                'gridLineWidth': new AttributeNumber('Grid Line Width', 0.25, null, new Range()),
                'gridLineColor': new AttributeColor('Grid Line Color', '#ffffff')
        };
        // tabbar
        tabbar;
        // moving popup
        movePopup = null;
        // mouse controls
        cursor;
        // update cycle for canvas
        animationFrame;

        constructor() {
                // build editor html
                // TABBAR
                this.tabbar = new Tabbar(this.settings.tabbarSelector.value);
                // 'File' tab
                this.tabbar.addTab('tab-file', 'File', 'file', true);
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createUploadProjectFileButton());
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createLoadStorageButton());
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createDownloadProjectButton());
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createSaveStorageButton());
                // 'Editor' tab
                this.tabbar.addTab('tab-editor', 'Editor', 'newspaper', true);
                this.tabbar.tabs['tab-editor'].addDropdownItem(this.createOpenEditorSettingsButton());
                // 'Project' tab
                this.tabbar.addTab('tab-project', 'Project', 'box-archive', true);
                this.tabbar.tabs['tab-project'].addDropdownItem(this.createOpenProjectSettingsButton());
                this.tabbar.tabs['tab-project'].addDropdownItem(this.createOpenRendererSettingsButton());
                this.tabbar.tabs['tab-project'].addDropdownItem(this.createOpenPhysicsSettingsButton());
                // 'About' tab
                this.tabbar.addTab('tab-about', 'About', 'circle-question', false, TABBAR_POSITION_END);
                this.tabbar.tabs['tab-about'].html.addEventListener('click', function() {
                        new Popup('About', this.createAboutPopupContent(), 'about_popup')
                }.bind(this));
                // 'Share' tab
                this.tabbar.addTab('tab-share', 'Share', 'share-nodes', false);
                this.tabbar.tabs['tab-share'].html.addEventListener('click', function() {
                        new Snackbar('Sharing projects is not implemented yet!', SNACKBAR_WARNING);
                });

                // 'start play mode' button
                document.body.appendChild(this.createPlayButton());

                // build editor object
                // prepare canvas
                this.canvas = document.querySelector(this.settings.canvasSelector.value);
                // create new project todo: add check if save is found in storage - otherwise load new project
                this.project = new Project();

                // add a basic renderer
                this.renderer = new RendererEngine();

                // choose first scene in project as current scene
                this.currentScene = this.project.sceneList[0];
                this.currentGameObject = null;

                // create cursor class instance for input tracking
                this.cursor = new Cursor();
                this.canvasZoom = 1;

                // set canvas background color from project settings
                this.canvas.style.backgroundColor = this.project.settings['canvasBackgroundColor'];

                // ADD EVENT LISTENERS
                document.addEventListener('mousedown', this);
                document.addEventListener('mouseup', this);
                document.addEventListener('mousemove', this);
                document.addEventListener('click', this);
                document.addEventListener('wheel', this);
                document.addEventListener('current_gameObject_name_changed', this);
                // custom events
                window.addEventListener('project_settings_changed', this);
                window.addEventListener('scene_list_changed', this);
        }

        start() {
                this.generateEditorElements();

                // prepare canvas
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.canvasContext = this.canvas.getContext('2d');

                // create new camera and move it to the center (X:0, Y:0 at the center)
                this.camera = new Camera(this.canvas.width, this.canvas.height);
                this.camera.worldPos = new Vector2(-this.camera.canvas.width / 2, -this.camera.canvas.height / 2);

                this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));
        }

        // process all necessary steps for the current frame
        // e.g. calculations, rendering, etc.
        processFrame() {
                if ((this.currentScene !== null) &&
                    (typeof this.currentScene !== 'undefined'))
                {
                        // clear canvas and camera view
                        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.camera.clear();

                        // process scene frame and draw grid
                        this.processCurrentSceneFrame();
                        if (this.currentGizmo !== null) {
                                this.currentGizmo.renderGizmo(this.camera);
                        }
                        this.drawGrid();

                        // get view of editor camera
                        this.canvasContext.drawImage(this.camera.canvas, 0, 0);
                }

                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        // process frame for current scene
        processCurrentSceneFrame() {
                let i = 0;
                const l = this.currentScene.gameObjects.length;

                while (i < l) {
                        this.processGameObjectFrame(this.currentScene.gameObjects[i]);

                        ++i;
                }
        }

        // process frame for the passed GameObject
        processGameObjectFrame(gameObject) {
                // skip all disabled gameObjects
                if (gameObject.attributes['enabled'].value === true) {
                        // loop through all components in the current gameObject
                        let i = 0;
                        const l = gameObject.components.length;

                        while (i < l) {
                                this.processComponentFrame(gameObject.components[i]);

                                ++i;
                        }
                }
        }

        // process frame for the passed component
        processComponentFrame(component) {
                // skip all components that are disabled
                if (component.attributes['enabled'].value === true) {
                        // Renderer components
                        if (component instanceof Renderer) {
                                // we need to update the renderer components to get the correct world position
                                component.update();
                                component.render(this.camera);
                        }

                        if (component instanceof Collider) {
                                component.updateWorldPos();
                        }
                }
        }

        // draw editor grid
        drawGrid() {
                if (this.settings['displayGrid'].value === true) {
                        this.canvasContext.save();
                        this.canvasContext.lineWidth = this.settings['gridLineWidth'].value;
                        this.canvasContext.strokeStyle = this.settings['gridLineColor'].value;

                        const gridOffsetX = -(this.camera.worldPos.x % this.settings['gridSize'].value.x);
                        for (let i = gridOffsetX; i < this.canvas.width; i += this.settings['gridSize'].value.x) {
                                this.canvasContext.beginPath();

                                this.canvasContext.moveTo(i, 0);
                                this.canvasContext.lineTo(i, this.canvas.height);

                                this.canvasContext.stroke();
                        }

                        const gridOffsetY = -(this.camera.worldPos.y % this.settings['gridSize'].value.y);
                        for (let j = gridOffsetY; j < this.canvas.height; j += this.settings['gridSize'].value.y) {
                                this.canvasContext.beginPath();

                                this.canvasContext.moveTo(0, j);
                                this.canvasContext.lineTo(this.canvas.width, j);

                                this.canvasContext.stroke();
                        }

                        this.canvasContext.restore();
                }
        }

        // stops everything
        stop() {
                window.cancelAnimationFrame(this.animationFrame);
        }

        // == LOCAL STORAGE ==
        // save current project to localStorage
        saveProjectToStorage() {
                localStorage.setItem('project', this.project.convertToJson());
        }

        // load a project from the localStorage
        loadProjectFromStorage() {
                const json = localStorage.getItem('project');

                if ((json !== null) &&
                    (typeof json !== 'undefined'))
                {
                        this.project = this.project.convertToProject(json);
                        new Snackbar('Project successfully loaded from storage.', SNACKBAR_SUCCESS);
                } else {
                        new Snackbar('No Project in storage. Try saving one first.', SNACKBAR_WARNING);
                }
        }

        // == CUSTOM HTML BUTTON ELEMENTS ==
        // create editor HTML Element for loading a project from an uploaded file
        createUploadProjectFileButton() {
                const wrapper = new HtmlElement('div', null, {class: 'upload_file'});

                // create file input element
                const input = new HtmlElement('input', null, {
                        class: 'content hidden',
                        type: 'file',
                        accept: 'application/json',
                        id: 'load-project-from-file'
                });
                input.addEventListener('change', function(e) {
                        const file = e.target.files[0];

                        if (file.type !== 'application/json') {
                                console.warn("only .json files are accepted!");
                                return false;
                        }

                        const reader = new FileReader();

                        reader.addEventListener('load', function() {
                                this.project = this.project.convertToProject(reader.result);
                        }.bind(this));

                        if (file) {
                                reader.readAsText(file);
                        }
                }.bind(this));

                // create label for input element
                const label = new HtmlElement('label', 'Load Project From File', {
                        class: 'button_link',
                        title: 'Upload a JSON file to import a project',
                        for: input.id
                });

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-file-export'});

                label.prepend(icon);

                wrapper.appendChild(input);
                wrapper.appendChild(label);

                return wrapper;
        }

        // create editor HTML element for turning the current project into a .json file and downloading it
        createDownloadProjectButton() {
                const fileDownload = new HtmlElement('div', null, {class: 'download_file'});

                // create fake link
                const label = new HtmlElement('div', 'Save Project As File', {
                        class: 'button_link',
                        title: 'Export the project as a JSON file'
                });
                label.addEventListener('click', function() {
                        // create invisible link element when clicked
                        const link = new HtmlElement('a', null, {
                                class: 'button_link',
                                href: 'data:text/json;charset=utf-8,' + encodeURIComponent(this.project.convertToJson()),
                                download: `${this.project.settings['name']}-${Date.now()} .json`
                        });
                        // click link automatically and remove it afterwards
                        link.click();
                        link.remove();
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-file-import'});

                label.prepend(icon);
                fileDownload.appendChild(label);

                return fileDownload;
        }

        // create editor HTML element for saving the current project in the localStorage
        createSaveStorageButton() {
                const saveStorage = new HtmlElement('div', null, {class: 'save_storage'});

                // create link
                const link = new HtmlElement('a', 'Save Project To Storage', {
                        class: 'button_link',
                        title: 'Save the project to the browser`s local storage'
                });
                link.addEventListener('click', function() {
                        this.saveProjectToStorage();

                        new Snackbar('Project saved to storage.', SNACKBAR_SUCCESS);
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-download'});

                link.prepend(icon);
                saveStorage.appendChild(link);

                return saveStorage;
        }

        // create editor HTML element for loading a project from the localStorage
        createLoadStorageButton() {
                const loadStorage = new HtmlElement('div', null, {class: 'save_storage'});

                // create link
                const link = new HtmlElement('a', 'Load Project From Storage', {
                        class: 'button_link',
                        title: 'Load the project currently in the browser`s local storage'
                });
                link.addEventListener('click', function() {
                        this.loadProjectFromStorage();
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-upload'});

                link.prepend(icon);
                loadStorage.appendChild(link);

                return loadStorage;
        }

        // create editor HTML element for opening the project settings popup
        createOpenEditorSettingsButton() {
                const openSettings = new HtmlElement('div', null, {class: 'editor_settings'});

                // create button
                const button = new HtmlElement('div', 'Editor Settings', {
                        class: 'button_link',
                        title: 'Change the editor settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Editor Settings', this.createEditorSettingsForm(), 'editor_settings');
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-sliders'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        createEditorSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'editor-settings-form'});

                // create widgets for all attributes
                for (let key in this.settings) {
                        const widget = this.settings[key].createWidget();

                        form.appendChild(widget);
                }

                return form;
        }

        // create editor HTML element for opening the project settings popup
        createOpenProjectSettingsButton() {
                const openSettings = new HtmlElement('div', null, {class: 'project_settings'});

                // create button
                const button = new HtmlElement('div', 'Project Settings', {
                        class: 'button_link',
                        title: 'Edit the project settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Project Settings', this.createProjectSettingsForm(), 'project_settings');
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-sliders'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        // create HTML form with this project's settings
        createProjectSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'project-settings-form'});

                // create an input field for each setting
                for (let key in this.project.settings) {
                        const formItem = new HtmlElement('div', null, {class: 'form_item'});

                        const label = new HtmlElement('label', key, {for: `item-${key}`});

                        const input = new HtmlElement('input', null, {
                                id: `item-${key}`,
                                type: 'text',
                                value: this.project.settings[key]
                        });

                        formItem.append(label);
                        formItem.append(input);

                        form.appendChild(formItem);
                }

                // add a submit button
                const submitItem = new HtmlElement('div', null, {class: 'form_item'});

                const submitButton = new HtmlElement('input', null, {
                        class: 'fake_button',
                        type: 'submit',
                        value: 'Save Changes'
                });

                submitItem.appendChild(submitButton);
                form.appendChild(submitItem);

                form.addEventListener('submit', function(e) {
                        e.preventDefault();

                        let i = 0;
                        const l = form.children.length;
                        // loop all form items and update this project's settings
                        while (i < l) {
                                const item = form.children[i];
                                const itemInput = item.querySelector('input');
                                const itemLabel = item.querySelector('label');

                                if (itemInput.type !== 'submit') {
                                        const setting = itemLabel.innerHTML;
                                        const newValue = itemInput.value;

                                        this.project.settings[setting] = newValue;
                                }

                                ++i;
                        }

                        window.dispatchEvent(new Event('project_settings_changed'));
                        // remove popup after submitting
                        e.target.closest('.popup').remove();
                }.bind(this));

                return form;
        }

        // create HTML form with this project's renderer settings
        createOpenRendererSettingsButton() {
                const openSettings = new HtmlElement('div', null, {class: 'renderer_settings'});

                // create button
                const button = new HtmlElement('div', 'Renderer Settings', {
                        class: 'button_link',
                        title: 'Edit the project`s renderer settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Renderer Settings', this.createRendererSettingsForm(), 'renderer_settings');
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-image'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        // create HTML form with this project's renderer settings
        createRendererSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'renderer-settings-form'});

                // create an input field for each setting
                for (let key in this.project.rendererEngine.settings) {
                        const widget = this.project.rendererEngine.settings[key].createWidget();

                        form.appendChild(widget);
                }

                return form;
        }

        // create HTML form with this project's physics settings
        createOpenPhysicsSettingsButton() {
                const openSettings = new HtmlElement('div', null, {class: 'physics_settings'});

                // create button
                const button = new HtmlElement('div', 'Physics Settings', {
                        class: 'button_link',
                        title: 'Edit the project`s physics settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Physics Settings', this.createPhysicsSettingsForm(), 'physics_settings');
                }.bind(this));

                // add font awesome icon
                const icon = new HtmlElement('i', null, {class: 'fa fa-explosion'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        createPhysicsSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'physics-settings-form'});

                // create widgets for all attributes
                for (let key in this.project.physicsEngine.attributes) {
                        const widget = this.project.physicsEngine.attributes[key].createWidget();

                        form.appendChild(widget);
                }

                return form;
        }

        // create editor HTML element the about popup
        createAboutPopupContent() {
                const wrapper = new HtmlElement('div', null, {});

                const engineName = new HtmlElement('div', 'Voodoo Game-Engine', {class: 'engine_name mt_10 text_bold text_center'});
                wrapper.appendChild(engineName);

                const version = new HtmlElement('div', 'v1.0a', {class: 'version text_center'});
                wrapper.appendChild(version);

                const infoText = new HtmlElement('div', 'Voodoo is an open source JavaScript based in-browser game engine and is free to use.<br>Please report any that try to sell this engine for profit!<br><br>Feel free to experiment with the different components and the editor.<br>Thank you for using Voodoo!', {class: 'engine_info mx_20 text_center'});
                wrapper.appendChild(infoText);

                const creator = new HtmlElement('div', 'Created by Sven May', {class: 'creator'});
                wrapper.appendChild(creator);

                const supportButton = new HtmlElement('a', 'Support the creator', {class: 'fake_button button_link support py_5 px_10', href: '#'});
                wrapper.appendChild(supportButton);

                return wrapper;
        }

        createPlayButton() {
                const wrapper = new HtmlElement('div', '', {id: 'play-button', title: 'Start Play-Mode', class: 'py_10 px_20'});
                wrapper.addEventListener('click', function() {
                        this.startPlayMode();
                }.bind(this));

                const icon = new HtmlElement('i', '', {class: 'fa fa-play'});
                wrapper.appendChild(icon);

                return wrapper;
        }

        // == PLAY MODE ==
        startPlayMode() {
                new Snackbar('Starting Play-Mode...', SNACKBAR_NEUTRAL);

                this.saveProjectToStorage();

                const currentUrl = window.location.origin + window.location.pathname;
                window.open(currentUrl.replace('edit_mode', 'play_mode'), '_blank').focus();
        }

        // == SCENES ==
        // create editor HTML element for the scene list
        createScenesListElement() {
                let i = 0;
                const l = this.project.sceneList.length;

                while (i < l) {
                        // loop all scenes in project and add scene card HTML
                        this.createSceneCardElement(this.project.sceneList[i]);

                        ++i;
                }

                // "add new scene" button
                const button = new HtmlElement('div', '&#x2b Add New Scene', {
                        class: 'fake_button mt_auto',
                        title: 'Adds a new scene to the project'
                });
                button.addEventListener('click', function() {
                        this.project.addScene(new Scene(this.project));
                        this.reloadEditorElements();

                        new Snackbar('New Scene successfully added', SNACKBAR_SUCCESS);
                }.bind(this));

                document.querySelector(this.project.settings.sceneListWrapper).appendChild(button);
        }

        // remove all editor HTML elements for the scenes list
        removeScenesListElement() {
                const sceneListNode = document.querySelector(this.project.settings.sceneListWrapper);

                let i = 0;
                const l = sceneListNode.children.length;

                while (i < l) {
                        sceneListNode.lastElementChild.remove();

                        ++i;
                }
        }

        // create editor HTML element for the scene
        createSceneCardElement(scene) {
                const wrapper = new HtmlElement('div', null, {class: 'scene'});

                const name = scene.attributes['name'].createWidget();

                wrapper.appendChild(name);

                if (scene !== this.currentScene) {
                        const button = new HtmlElement('div', 'Select', {class: 'fake_button'});
                        button.addEventListener('click', function() {
                                this.project.loadScene(this.project.getSceneIndex(scene));

                                window.dispatchEvent(new Event('scene_list_changed'));
                        }.bind(this));

                        wrapper.appendChild(button);
                }

                const listNode = document.querySelector(this.project.settings.sceneListWrapper);
                listNode.appendChild(wrapper);
        }

        // == GAMEOBJECTS ==
        // create editor HTML for all gameObjects
        createGameObjectsListElement() {
                let i = 0;
                let l = this.currentScene.gameObjects.length;

                while (i < l) {
                        // loop all game objects in the current scene
                        this.createGameObjectCardElement(this.currentScene.gameObjects[i]);

                        ++i;
                }

                // "add new gameObject" form
                const select = new HtmlElement('select', 'Adds a new Game Object to the selected scene', {class: 'add_gameObject'});

                const defaultOption = new HtmlElement('option', '&#x2b; Add new Game Object', {value: 0});

                select.appendChild(defaultOption);

                i = 0;
                l = this.availableGameObjects.length;

                while (i < l) {
                        // loop all available game objects for the dropdown
                        const option = new HtmlElement('option', this.availableGameObjects[i], {value: this.availableGameObjects[i]});

                        select.appendChild(option);

                        ++i;
                }

                select.addEventListener('change', function(e) {
                        const selectedOption = e.target.children[e.target.selectedIndex].value;

                        if (selectedOption !== 0) {
                                let newObject = eval(`new ${selectedOption.replace(' ', '')}()`);

                                this.currentScene.addGameObject(newObject);
                        }

                        this.reloadEditorElements();
                }.bind(this));

                document.querySelector(this.project.settings.gameObjectListWrapper).appendChild(select);
        }

        // create editor HTML element for the gameObject title
        createGameObjectTitleElement(gameObject) {
                const content = new HtmlElement('div', null, {class: 'content'});

                for (let key in gameObject.attributes) {
                        if (gameObject.attributes[key] instanceof AttributeText) {
                                const widget = gameObject.attributes[key].createWidget();

                                content.appendChild(widget);
                        }
                }

                return content;
        }

        // remove all editor HTML elements in the game objects list
        removeGameObjectsListElement() {
                const gameObjectsNode = document.querySelector(this.project.settings.gameObjectListWrapper);

                let i = 0;
                const l = gameObjectsNode.children.length;

                while (i < l) {
                        gameObjectsNode.lastElementChild.remove();

                        ++i;
                }
        }

        // create editor HTML element per game object
        createGameObjectCardElement(gameObject) {
                const wrapper = new HtmlElement('div', null, {class: 'game_object'});

                wrapper.addEventListener('click', function(e) {
                        const thisElement = e.target.closest('.game_object');

                        if (!thisElement.classList.contains('selected')) {
                                const selected = thisElement.parentElement.querySelector('.selected');
                                if ((selected !== null) &&
                                    (selected !== thisElement))
                                {
                                        selected.classList.remove('selected');
                                        this.removeComponentsListElement();
                                }

                                this.createComponentsListElement(gameObject);
                                thisElement.classList.add('selected');
                                this.currentGameObject = gameObject;
                                this.currentGameObjectHTML = thisElement;
                                this.currentGizmo = gameObject.transform;
                        } else {
                                thisElement.classList.remove('selected');
                                this.removeComponentsListElement();
                                this.currentGameObject = null;
                                this.currentGameObjectHTML = null;
                                this.currentGizmo = null;
                        }
                }.bind(this));

                const title = new HtmlElement('div', gameObject.attributes['name'].value, {class: 'title'});

                wrapper.appendChild(title);

                const listNode = document.querySelector(this.project.settings.gameObjectListWrapper);
                listNode.appendChild(wrapper);
        }

        // == COMPONENTS ==
        // create editor HTML element containing all components
        createComponentsListElement(gameObject) {
                // create info card
                const card = new HtmlElement('div', null, {class: 'card components_list'});
                const title = new HtmlElement('div', null, {class: 'card_title'});
                title.appendChild(this.createGameObjectTitleElement(gameObject));

                const content = new HtmlElement('div', null, {class: 'card_content'});

                // add component cards to card content
                let i = 0;
                const l = gameObject.components.length;

                while (i < l) {
                        const component = gameObject.components[i];
                        let additionalContent = null;

                        if (component instanceof Collider) {
                                const showGizmoButton = new HtmlElement('div', 'Toggle Gizmo', {class: 'fake_button'});
                                showGizmoButton.addEventListener('click', function() {
                                        if (this.currentGizmo === component) {
                                                this.currentGizmo = component.gameObject.transform;
                                        } else {
                                                this.currentGizmo = component;
                                        }
                                }.bind(this));

                                additionalContent = showGizmoButton;
                        }

                        content.appendChild(component.createEditorCard(additionalContent));

                        ++i;
                }

                // add new component select to card content
                const select = this.createAddComponentMenu(gameObject);

                content.appendChild(select);

                card.appendChild(title);
                card.appendChild(content);

                const listNode = document.querySelector(this.project.settings.componentListWrapper);
                listNode.appendChild(card);
        }

        // remove all editor HTML elements for the components
        removeComponentsListElement() {
                const componentsListNode = document.querySelector(this.project.settings.componentListWrapper);

                let i = 0;
                const l = componentsListNode.children.length;

                while (i < l) {
                        componentsListNode.lastElementChild.remove();

                        ++i;
                }
        }

        createAddComponentMenu(gameObject) {
                const dropdown = new HtmlElement('div', null, {id: 'add-component-dropdown', class: 'dropdown_list'});
                const button = new HtmlElement('button', '&#x2b; Add Component', {class: 'dropdown_button'});
                button.addEventListener('mousedown', function() {
                        const openCategory = dropdown.querySelector('.dropdown_menu_category.open');
                        if (openCategory !== null) {
                                openCategory.classList.remove('open');
                        }

                        dropdown.classList.toggle('open');
                });

                const menu = new HtmlElement('div', null, {class: 'dropdown_list_menu'});

                // add categories
                for (const key in this.availableComponents) {
                        const category = this.availableComponents[key];
                        const categoryHtml = new HtmlElement('div', null, {class: 'dropdown_menu_category'});

                        const categoryTitle = new HtmlElement('div', null, {class: 'title'});
                        categoryTitle.addEventListener('click', function() {
                                categoryHtml.classList.add('open');
                                menu.classList.add('category_open');
                        });

                        const titleText = new HtmlElement('span', key);
                        const titleIcon = new HtmlElement('i', null, {class: 'fa fa-chevron-right mr_5 float_right'});

                        categoryTitle.appendChild(titleText);
                        categoryTitle.appendChild(titleIcon);

                        categoryHtml.appendChild(categoryTitle);

                        const categoryBack = new HtmlElement('div', null, {class: 'back'});
                        categoryBack.addEventListener('click', function() {
                                categoryHtml.classList.remove('open');
                                menu.classList.remove('category_open');
                        });

                        const backIcon = new HtmlElement('i', null, {class: 'fa fa-chevron-left mr_5'});
                        const backText = new HtmlElement('span', 'Go Back');

                        categoryBack.appendChild(backIcon);
                        categoryBack.appendChild(backText);

                        categoryHtml.appendChild(categoryBack);

                        // add category items
                        let i = 0;
                        const l = category.length;

                        while (i < l) {
                                const item = category[i];
                                const itemHtml = new HtmlElement('div', item, {class: 'dropdown_menu_item'});
                                itemHtml.addEventListener('click', function() {
                                        const newComponent = eval(`new ${item.replace(' ', '')}()`);
                                        gameObject.addComponent(newComponent);

                                        // close dropdown and category
                                        categoryHtml.classList.remove('open');
                                        menu.classList.remove('category_open');
                                        dropdown.classList.remove('open');

                                        // add "toggle gizmo" button for certain components
                                        let additionalContent = null;

                                        if (newComponent instanceof Collider) {
                                                const showGizmoButton = new HtmlElement('div', 'Toggle Gizmo', {class: 'fake_button'});
                                                showGizmoButton.addEventListener('click', function() {
                                                        if (this.currentGizmo === newComponent) {
                                                                this.currentGizmo = newComponent.gameObject.transform;
                                                        } else {
                                                                this.currentGizmo = newComponent;
                                                        }
                                                }.bind(this));

                                                additionalContent = showGizmoButton;
                                        }

                                        const componentCardElement = newComponent.createEditorCard(additionalContent);
                                        const parent = document.querySelector('.components_list .card_content');
                                        const nextSibling = document.getElementById('add-component-dropdown');

                                        parent.insertBefore(componentCardElement, nextSibling);
                                }.bind(this));

                                categoryHtml.appendChild(itemHtml);

                                ++i;
                        }

                        menu.appendChild(categoryHtml);
                }

                dropdown.appendChild(button);
                dropdown.appendChild(menu);

                return dropdown;
        }

        // create editor HTML for the current project
        generateEditorElements() {
                // load sceneList
                this.createScenesListElement();

                // load gameObjects
                this.createGameObjectsListElement();
        }

        // remove all current editor HTML elements
        clearEditorElements() {
                // scenes
                this.removeScenesListElement();

                // game Objects
                this.removeGameObjectsListElement();

                // components
                this.removeComponentsListElement();
        }

        // clear and create editor HTML
        reloadEditorElements() {
                this.clearEditorElements();
                this.generateEditorElements();
        }

        // == HTML ELEMENTS ==
        // dropdown functions
        closeAllTabDropdowns(tabbar = null) {
                let dropdowns = document.querySelectorAll('.tabbar .dropdown');

                if (tabbar !== null) {
                        dropdowns = tabbar.querySelectorAll('.dropdown');
                }

                let i = 0;
                const l = dropdowns.length;

                while (i < l) {
                        dropdowns[i].classList.remove('open');

                        ++i;
                }
        }

        // == EVENTS ==
        // event handler function
        handleEvent(e) {
                const eventLookup = {
                        project_settings_changed: function(e) {
                                this.onProjectSettingsChanged(e);
                        }.bind(this),
                        scene_list_changed: function(e) {
                                this.onSceneListChanged(e);
                        }.bind(this),
                        mousedown: function(e) {
                                this.onMousedown(e);
                        }.bind(this),
                        mouseup: function(e) {
                                this.onMouseup(e);
                        }.bind(this),
                        mousemove: function(e) {
                                this.onMousemove(e);
                        }.bind(this),
                        click: function(e) {
                                this.onClick(e);
                        }.bind(this),
                        wheel: function(e) {
                                this.onWheel(e);
                        }.bind(this),
                        current_gameObject_name_changed: function(e) {
                                this.onCurrentGameObjectNameChanged(e);
                        }.bind(this),
                        default: function(e) {
                                console.warn(`Unexpected event: ${e.type}`);
                        }.bind(this)
                };

                return (eventLookup[e.type] || eventLookup['default'])(e);
        }

        // event function that is called on 'mousedown' event on canvas
        onMousedown(e) {
                if (e.which == 1) {
                        // if a popup title has been clicked - move popup
                        if (e.target.closest('.popup_title') !== null) {
                                this.movePopup = e.target.closest('.popup');
                        }
                } else if (e.which == 2) {
                        // if editor canvas has been clicked - move camera
                        if (e.target.closest(this.settings['canvasSelector'].value) !== null) {
                                this.cursor.wheelClick = true;
                                this.cursor.wheelClickDownPos = new Vector2(e.clientX, e.clientY);
                        }
                } else if (e.which == 3) {
                        if (e.target.closest(this.settings['canvasSelector'].value) !== null) {
                                this.cursor.rightClick = true;
                                this.cursor.rightClickDownPos = new Vector2(e.clientX, e.clientY);
                        }
                }
        }

        // event function that is called on 'mouseup' event on canvas
        onMouseup(e) {
                if (e.which == 1) {
                        this.cursor.leftClick = false;
                        this.cursor.leftClickUpPos = new Vector2(e.clientX, e.clientY);

                        this.movePopup = null;
                } else if (e.which == 2) {
                        this.cursor.wheelClick = false;
                        this.cursor.wheelClickUpPos = new Vector2(e.clientX, e.clientY);
                } else if (e.which == 3) {
                        this.cursor.rightClick = false;
                        this.cursor.rightClickUpPos = new Vector2(e.clientX, e.clientY);
                }
        }

        // event function that is called on 'mousemove' event on canvas
        onMousemove(e) {
                if (e.target !== document) {
                        if (e.target.closest(this.settings['canvasSelector'].value) !== null) {
                                this.hovering = this.canvas;
                        }

                        // if no gizmo is being hovered and the wheel (middle button) is being held down, move the camera
                        if ((this.cursor.wheelClick === true) &&
                            (this.hovering === this.canvas))
                        {
                                let mouseMovement = new Vector2(e.movementX, e.movementY);
                                this.camera.worldPos = Vector2.subtract(this.camera.worldPos, mouseMovement);
                        }

                        // move popup if one is being dragged
                        if (this.movePopup !== null) {
                                this.movePopup.style.top = this.movePopup.offsetTop + e.movementY + 'px';
                                this.movePopup.style.left = this.movePopup.offsetLeft + e.movementX + 'px';
                        }
                }
        }

        // event function that is called on 'click' event on document
        onClick(e) {
                // dropdown
                const dropdownButton = e.target.closest('.dropdown_button');

                if (dropdownButton !== null) {
                        const closestDropdown = dropdownButton.closest('.dropdown');

                        this.closeAllTabDropdowns(dropdownButton.closest('.tabbar'));

                        if (closestDropdown !== null) {
                                closestDropdown.classList.add('open');
                        }
                } else {
                        this.closeAllTabDropdowns();
                }

                // foldout
                const foldoutTitle = e.target.closest('.foldout_title');

                if (foldoutTitle !== null) {
                        const closestFoldout = foldoutTitle.closest('.foldout');
                        closestFoldout.classList.toggle('open');
                }
        }

        // event function that is called on 'wheel' event on canvas
        onWheel(e) {
                // todo: fix the scaling !!! -> currently miscalculates zoom level and canvas needs to be stretched / shrunken to be fully visible
                /*
                if (e.wheelDelta > 0) {
                        this.canvasZoom += 0.5;
                } else {
                        this.canvasZoom -= 0.5;
                }

                // clamp zoom
                this.canvasZoom = Math.clamp(this.canvasZoom, 0.5, 1.5);

                this.camera.canvasContext.scale(this.canvasZoom, this.canvasZoom);
                */
        }

        onCurrentGameObjectNameChanged(e) {
                const gameObjectTitle = this.currentGameObjectHTML.querySelector('.title');
                gameObjectTitle.innerHTML = this.currentGameObject.attributes['name'].value;
        }

        // event function that is called on custom 'scene_ist_changed' event on the window
        onScenelistchanged(e) {
                this.reloadEditorElements();
        }

        // event function that is called on custom 'project_settings_changed' event on the window
        onProjectsettingschanged(e) {
                // for now update canvas color
                this.canvas.style.backgroundColor = this.project.settings['canvasBackgroundColor'];
        }
}
