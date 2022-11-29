
// import base modules
import { Project } from './project.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { Cursor } from './cursor.js';

// import game objects
import { GameObject } from './game_objects/game_object.js';

// import collection
import { Vector2 } from './collection/vector2.js';

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

// import gizmos
import { TransformUpArrowGizmo } from './editor/gizmos/transform_up_arrow_gizmo.js';
import { TransformRightArrowGizmo } from './editor/gizmos/transform_right_arrow_gizmo.js';
import { TransformCenterBoxGizmo } from './editor/gizmos/transform_center_box_gizmo.js';

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
        currentComponent;
        currentComponentHTML;
        currentComponentGizmos = [];
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
        availableComponents = [
                'Camera',
                'Box Renderer',
                'Circle Renderer',
                'Sprite Renderer',
                //'Polygon Renderer',
                //'Polygon Circle Renderer',
                //'Polygon Capsule Renderer',
                'Box Collider',
                'Circle Collider',
                //'Capsule Collider',
                'Rigidbody',
                'Animation'
        ];
        // settings
        settings = {
                'tabbarSelector': new AttributeText('Tabbar Selector', '#editor-tabbar'),
                'canvasSelector': new AttributeText('Canvas Selector', '#gameArea'),
                'displayGrid': new AttributeBoolean('Display Grid', true),
                'gridSize': new AttributeVector2('Grid Size', new Vector2(100, 100)),
                'gridLineWidth': new AttributeNumber('Grid Line Width', 0.25),
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
                // create new project @todo: add check if save is found in storage - otherwise load new project
                this.project = new Project();

                // add a basic renderer
                this.renderer = new Renderer();

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

        // @todo: this is ugly - make it more readable!
        processFrame() {
                if ((this.currentScene !== null) &&
                    (typeof this.currentScene !== 'undefined'))
                {
                        // clear canvas and camera view
                        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.camera.clear();

                        // process scene frame and draw grid
                        this.processCurrentSceneFrame();
                        this.drawGrid();

                        // get view of editor camera
                        this.canvasContext.drawImage(this.camera.canvas, 0, 0);
                }

                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        // process frame for current scene
        processCurrentSceneFrame() {
                let i = 0;
                let l = this.currentScene.gameObjects.length;
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
                        let l = gameObject.components.length;
                        while (i < l) {
                                this.processComponentFrame(gameObject.components[i]);

                                ++i;
                        }

                        // @todo: improve the gizmo display - add cursor checks to this as well
                        // @todo: differentiate between components - currently only transform gizmos
                        if (gameObject === this.currentGameObject) {
                                // transform.up arrow
                                let upArrow = new TransformUpArrowGizmo(gameObject.transform);
                                // transform.right arrow
                                let rightArrow = new TransformRightArrowGizmo(gameObject.transform);
                                // center box - transform position
                                let centerBox = new TransformCenterBoxGizmo(gameObject.transform);
                                this.currentComponentGizmos = [upArrow, rightArrow, centerBox];

                                let g = 0;
                                let gl = this.currentComponentGizmos.length;
                                while (g < gl) {
                                        this.currentComponentGizmos[g].render(this.camera);

                                        ++g;
                                }
                        }
                }
        }

        // process frame for the passed component
        processComponentFrame(component) {
                // skip all components that are disabled
                if (component.attributes['enabled'].value === true) {
                        // component renderer components
                        if (component instanceof ComponentRenderer) {
                                // we need to update the renderer components to get the correct world position
                                component.update();
                                component.render(this.camera);
                        }
                }
        }

        // draw editor grid
        drawGrid() {
                if (this.settings['displayGrid'].value === true) {
                        this.canvasContext.save();
                        this.canvasContext.lineWidth = this.settings['gridLineWidth'].value;
                        this.canvasContext.strokeStyle = this.settings['gridLineColor'].value;

                        let gridOffsetX = -(this.camera.worldPos.x % this.settings['gridSize'].value.x);
                        for (let i = gridOffsetX; i < this.canvas.width; i += this.settings['gridSize'].value.x) {
                                this.canvasContext.beginPath();

                                this.canvasContext.moveTo(i, 0);
                                this.canvasContext.lineTo(i, this.canvas.height);

                                this.canvasContext.stroke();
                        }

                        let gridOffsetY = -(this.camera.worldPos.y % this.settings['gridSize'].value.y);
                        for (let j = gridOffsetY; j < this.canvas.height; j += this.settings['gridSize'].value.y) {
                                this.canvasContext.beginPath();

                                this.canvasContext.moveTo(0, j);
                                this.canvasContext.lineTo(this.canvas.width, j);

                                this.canvasContext.stroke();
                        }

                        this.canvasContext.restore();
                }
        }

        stop() {
                window.cancelAnimationFrame(this.animationFrame);
        }

        /* LOCAL STORAGE */
        // save current project to localStorage
        saveProjectToStorage() {
                localStorage.setItem('project', this.project.convertToJson());
        }

        // load a project from the localStorage
        loadProjectFromStorage() {
                let json = localStorage.getItem('project');

                if ((json !== null) &&
                    (typeof json !== 'undefined'))
                {
                        this.project = this.project.convertToProject(json);
                        new Snackbar('Project successfully loaded from storage.', SNACKBAR_SUCCESS);
                } else {
                        new Snackbar('No Project in storage. Try saving one first.', SNACKBAR_WARNING);
                }
        }

        /* CUSTOM HTML BUTTON ELEMENTS */
        // create editor HTML Element for loading a project from an uploaded file
        createUploadProjectFileButton() {
                let wrapper = new HtmlElement('div', null, {class: 'upload_file'});

                // create file input element
                let input = new HtmlElement('input', null, {
                        class: 'content hidden',
                        type: 'file',
                        accept: 'application/json',
                        id: 'load-project-from-file'
                });
                input.addEventListener('change', function(e) {
                        let file = e.target.files[0];

                        if (file.type !== 'application/json') {
                                console.warn("only .json files are accepted!");
                                return false;
                        }

                        let reader = new FileReader();

                        reader.addEventListener('load', function() {
                                this.project = this.project.convertToProject(reader.result);
                        }.bind(this));

                        if (file) {
                                reader.readAsText(file);
                        }
                }.bind(this));

                // create label for input element
                let label = new HtmlElement('label', 'Load Project From File', {
                        class: 'button_link',
                        title: 'Upload a JSON file to import a project',
                        for: input.id
                });

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-file-export'});

                label.prepend(icon);

                wrapper.appendChild(input);
                wrapper.appendChild(label);

                return wrapper;
        }

        // create editor HTML element for turning the current project into a .json file and downloading it
        createDownloadProjectButton() {
                let fileDownload = new HtmlElement('div', null, {class: 'download_file'});

                // create fake link
                let label = new HtmlElement('div', 'Save Project As File', {
                        class: 'button_link',
                        title: 'Export the project as a JSON file'
                });
                label.addEventListener('click', function() {
                        // create invisible link element when clicked
                        let link = new HtmlElement('a', null, {
                                class: 'button_link',
                                href: 'data:text/json;charset=utf-8,' + encodeURIComponent(this.project.convertToJson()),
                                download: `${this.project.settings['name']}-${Date.now()} .json`
                        });
                        // click link automatically and remove it afterwards
                        link.click();
                        link.remove();
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-file-import'});

                label.prepend(icon);
                fileDownload.appendChild(label);

                return fileDownload;
        }

        // create editor HTML element for saving the current project in the localStorage
        createSaveStorageButton() {
                let saveStorage = new HtmlElement('div', null, {class: 'save_storage'});

                // create link
                let link = new HtmlElement('a', 'Save Project To Storage', {
                        class: 'button_link',
                        title: 'Save the project to the browser`s local storage'
                });
                link.addEventListener('click', function() {
                        this.saveProjectToStorage();

                        new Snackbar('Project saved to storage.', SNACKBAR_SUCCESS);
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-download'});

                link.prepend(icon);
                saveStorage.appendChild(link);

                return saveStorage;
        }

        // create editor HTML element for loading a project from the localStorage
        createLoadStorageButton() {
                let loadStorage = new HtmlElement('div', null, {class: 'save_storage'});

                // create link
                let link = new HtmlElement('a', 'Load Project From Storage', {
                        class: 'button_link',
                        title: 'Load the project currently in the browser`s local storage'
                });
                link.addEventListener('click', function() {
                        this.loadProjectFromStorage();
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-upload'});

                link.prepend(icon);
                loadStorage.appendChild(link);

                return loadStorage;
        }

        // create editor HTML element for opening the project settings popup
        createOpenEditorSettingsButton() {
                let openSettings = new HtmlElement('div', null, {class: 'editor_settings'});

                // create button
                let button = new HtmlElement('div', 'Editor Settings', {
                        class: 'button_link',
                        title: 'Change the editor settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Editor Settings', this.createEditorSettingsForm(), 'editor_settings');
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-sliders'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        createEditorSettingsForm() {
                let form = new HtmlElement('form', null, {id: 'editor-settings-form'});

                // create widgets for all attributes
                for (let key in this.settings) {
                        let widget = this.settings[key].createWidget();

                        form.appendChild(widget);
                }
/* 
                // add a submit button
                let submitItem = new HtmlElement('div', null, {class: 'form_item'});

                let submitButton = new HtmlElement('input', null, {
                        class: 'fake_button',
                        type: 'submit',
                        value: 'Save Changes'
                });

                submitItem.appendChild(submitButton);
                form.appendChild(submitItem);
*/
                return form;
        }

        // create editor HTML element for opening the project settings popup
        createOpenProjectSettingsButton() {
                let openSettings = new HtmlElement('div', null, {class: 'project_settings'});

                // create button
                let button = new HtmlElement('div', 'Project Settings', {
                        class: 'button_link',
                        title: 'Edit the project settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Project Settings', this.createProjectSettingsForm(), 'project_settings');
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-sliders'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        // create HTML form with this project's settings
        createProjectSettingsForm() {
                let form = new HtmlElement('form', null, {id: 'project-settings-form'});

                // create an input field for each setting
                for (let key in this.project.settings) {
                        let formItem = new HtmlElement('div', null, {class: 'form_item'});

                        let label = new HtmlElement('label', key, {for: `item-${key}`});

                        let input = new HtmlElement('input', null, {
                                id: `item-${key}`,
                                type: 'text',
                                value: this.project.settings[key]
                        });

                        formItem.append(label);
                        formItem.append(input);

                        form.appendChild(formItem);
                }

                // add a submit button
                let submitItem = new HtmlElement('div', null, {class: 'form_item'});

                let submitButton = new HtmlElement('input', null, {
                        class: 'fake_button',
                        type: 'submit',
                        value: 'Save Changes'
                });

                submitItem.appendChild(submitButton);
                form.appendChild(submitItem);

                form.addEventListener('submit', function(e) {
                        e.preventDefault();

                        let i = 0;
                        let l = form.children.length;
                        // loop all form items and update this project's settings
                        while (i < l) {
                                let item = form.children[i];
                                let itemInput = item.querySelector('input');
                                let itemLabel = item.querySelector('label');

                                if (itemInput.type !== 'submit') {
                                        let setting = itemLabel.innerHTML;
                                        let newValue = itemInput.value;

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
                let openSettings = new HtmlElement('div', null, {class: 'renderer_settings'});

                // create button
                let button = new HtmlElement('div', 'Renderer Settings', {
                        class: 'button_link',
                        title: 'Edit the project`s renderer settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Renderer Settings', this.createRendererSettingsForm(), 'renderer_settings');
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-image'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        // create HTML form with this project's renderer settings
        createRendererSettingsForm() {
                let form = new HtmlElement('form', null, {id: 'renderer-settings-form'});

                // create an input field for each setting
                /*
                for (let key in this.project.settings) {
                        let formItem = new HtmlElement('div', null, {class: 'form_item'});

                        let label = new HtmlElement('label', key, {for: `item-${key}`});

                        let input = new HtmlElement('input', null, {
                                id: `item-${key}`,
                                type: 'text',
                                value: this.project.settings[key]
                        });

                        formItem.append(label);
                        formItem.append(input);

                        form.appendChild(formItem);
                }
                */

                // add a submit button
                let submitItem = new HtmlElement('div', null, {class: 'form_item'});

                let submitButton = new HtmlElement('input', null, {
                        class: 'fake_button',
                        type: 'submit',
                        value: 'Save Changes'
                });

                submitItem.appendChild(submitButton);
                form.appendChild(submitItem);
/*
                form.addEventListener('submit', function(e) {
                        e.preventDefault();

                        let i = 0;
                        let l = form.children.length;
                        // loop all form items and update this project's settings
                        while (i < l) {
                                let item = form.children[i];
                                let itemInput = item.querySelector('input');
                                let itemLabel = item.querySelector('label');

                                if (itemInput.type !== 'submit') {
                                        let setting = itemLabel.innerHTML;
                                        let newValue = itemInput.value;

                                        this.project.settings[setting] = newValue;
                                }

                                ++i;
                        }

                        window.dispatchEvent(new Event('project_settings_changed'));
                        // remove popup after submitting
                        e.target.closest('.popup').remove();
                }.bind(this));
*/
                return form;
        }

        // create HTML form with this project's physics settings
        createOpenPhysicsSettingsButton() {
                let openSettings = new HtmlElement('div', null, {class: 'physics_settings'});

                // create button
                let button = new HtmlElement('div', 'Physics Settings', {
                        class: 'button_link',
                        title: 'Edit the project`s physics settings'
                });
                button.addEventListener('click', function() {
                        new Popup('Physics Settings', this.createPhysicsSettingsForm(), 'physics_settings');
                }.bind(this));

                // add font awesome icon
                let icon = new HtmlElement('i', null, {class: 'fa fa-explosion'});

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        createPhysicsSettingsForm() {
                let form = new HtmlElement('form', null, {id: 'physics-settings-form'});

                // create widgets for all attributes
                for (let key in this.project.physics.attributes) {
                        let widget = this.project.physics.attributes[key].createWidget();

                        form.appendChild(widget);
                }
/* 
                // add a submit button
                let submitItem = new HtmlElement('div', null, {class: 'form_item'});

                let submitButton = new HtmlElement('input', null, {
                        class: 'fake_button',
                        type: 'submit',
                        value: 'Save Changes'
                });

                submitItem.appendChild(submitButton);
                form.appendChild(submitItem);
*/
                return form;
        }

        // create editor HTML element the about popup
        createAboutPopupContent() {
                let wrapper = new HtmlElement('div', null, {});

                let engineName = new HtmlElement('div', 'Voodoo', {class: 'engine_name mt_10 text_bold text_center'});
                wrapper.appendChild(engineName);

                let version = new HtmlElement('div', 'v1.0a', {class: 'version text_center'});
                wrapper.appendChild(version);

                let infoText = new HtmlElement('div', 'Voodoo is an open source JavaScript based in-browser game engine and is free to use.<br>Please report any that try to sell this engine for profit!<br><br>Feel free to experiment with the different components and the editor.<br>Thank you for using Voodoo!', {class: 'engine_info mx_20 text_center'});
                wrapper.appendChild(infoText);

                let creator = new HtmlElement('div', 'Created by Sven May', {class: 'creator'});
                wrapper.appendChild(creator);

                let supportButton = new HtmlElement('a', 'Support the creator', {class: 'fake_button button_link support py_5 px_10', href: '#'});
                wrapper.appendChild(supportButton);

                return wrapper;
        }

        createPlayButton() {
                let wrapper = new HtmlElement('div', '', {id: 'play-button', title: 'Start Play-Mode', class: 'py_10 px_20'});
                wrapper.addEventListener('click', function() {
                        this.startPlayMode();
                }.bind(this));

                let icon = new HtmlElement('i', '', {class: 'fa fa-play'});
                wrapper.appendChild(icon);

                return wrapper;
        }

        // PLAY MODE
        startPlayMode() {
                new Snackbar('Starting Play-Mode...', SNACKBAR_NEUTRAL);

                this.saveProjectToStorage();

                let currentUrl = window.location.origin + window.location.pathname;
                window.open(currentUrl.replace('edit_mode', 'play_mode'), '_blank').focus();
        }

        // SCENES
        // create editor HTML element for the scene list
        createScenesListElement() {
                let i = 0;
                let l = this.project.sceneList.length;
                while (i < l) {
                        // loop all scenes in project and add scene card HTML
                        this.createSceneCardElement(this.project.sceneList[i]);

                        ++i;
                }

                // "add new scene" button
                let button = new HtmlElement('div', '&#x2b Add New Scene', {
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
                let sceneListNode = document.querySelector(this.project.settings.sceneListWrapper);

                let i = 0;
                let l = sceneListNode.children.length;
                while (i < l) {
                        sceneListNode.lastElementChild.remove();

                        ++i;
                }
        }

        // create editor HTML element for the scene
        createSceneCardElement(scene) {
                let wrapper = new HtmlElement('div', null, {class: 'scene'});

                let name = scene.attributes['name'].createWidget();

                wrapper.appendChild(name);

                if (scene !== this.currentScene) {
                        let button = new HtmlElement('div', 'Select', {class: 'fake_button'});
                        button.addEventListener('click', function() {
                                this.project.loadScene(this.project.getSceneIndex(scene));

                                window.dispatchEvent(new Event('scene_list_changed'));
                        }.bind(this));

                        wrapper.appendChild(button);
                }

                let listNode = document.querySelector(this.project.settings.sceneListWrapper);
                listNode.appendChild(wrapper);
        }

        // GAMEOBJECTS
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
                let select = new HtmlElement('select', 'Adds a new Game Object to the selected scene', {class: 'add_gameObject'});

                let defaultOption = new HtmlElement('option', '&#x2b; Add new Game Object', {value: 0});

                select.appendChild(defaultOption);

                i = 0;
                l = this.availableGameObjects.length;
                while (i < l) {
                        // loop all available game objects for the dropdown
                        let option = new HtmlElement('option', this.availableGameObjects[i], {value: this.availableGameObjects[i]});

                        select.appendChild(option);

                        ++i;
                }

                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
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
                let content = new HtmlElement('div', null, {class: 'content'});

                for (let key in gameObject.attributes) {
                        if (gameObject.attributes[key] instanceof AttributeText) {
                                let widget = gameObject.attributes[key].createWidget();

                                content.appendChild(widget);
                        }
                }

                return content;
        }

        // remove all editor HTML elements in the game objects list
        removeGameObjectsListElement() {
                let gameObjectsNode = document.querySelector(this.project.settings.gameObjectListWrapper);

                let i = 0;
                let l = gameObjectsNode.children.length;
                while (i < l) {
                        gameObjectsNode.lastElementChild.remove();

                        ++i;
                }
        }

        // create editor HTML element per game object
        createGameObjectCardElement(gameObject) {
                let wrapper = new HtmlElement('div', null, {class: 'game_object'});
                wrapper.addEventListener('click', function(e) {
                        let thisElement = e.target.closest('.game_object');

                        if (!thisElement.classList.contains('selected')) {
                                let selected = thisElement.parentElement.querySelector('.selected');
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
                        } else {
                                thisElement.classList.remove('selected');
                                this.removeComponentsListElement();
                                this.currentGameObject = null;
                                this.currentGameObjectHTML = null;
                        }
                }.bind(this));

                let title = new HtmlElement('div', gameObject.attributes['name'].value, {class: 'title'});

                wrapper.appendChild(title);

                let listNode = document.querySelector(this.project.settings.gameObjectListWrapper);
                listNode.appendChild(wrapper);
        }

        // COMPONENTS
        // create editor HTML element containing all components
        createComponentsListElement(gameObject) {
                // create info card
                let card = new HtmlElement('div', null, {class: 'card components_list'});

                let title = new HtmlElement('div', null, {class: 'card_title'});

                title.appendChild(this.createGameObjectTitleElement(gameObject));

                let content = new HtmlElement('div', null, {class: 'card_content'});

                // add component cards to card content
                let i = 0;
                let l = gameObject.components.length;
                while (i < l) {
                        content.appendChild(this.createComponentCardElement(gameObject.components[i]));

                        ++i;
                }

                // add new component select to card content
                let select = new HtmlElement('select', null, {id: 'add-component-dropdown', title: 'Adds a new component to the selected GameObject'});

                let defaultOption = new HtmlElement('option', '&#x2b; Add New Component', {value: 0});
                select.appendChild(defaultOption);

                i = 0;
                l = this.availableComponents.length;
                while (i < l) {
                        let option = new HtmlElement('option', this.availableComponents[i], {value: this.availableComponents[i]});
                        select.appendChild(option);

                        ++i;
                }
                
                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
                        if (selectedOption !== 0) {
                                let newComponent = eval(`new ${selectedOption.replace(' ', '')}()`);

                                gameObject.addComponent(newComponent);

                                let componentCardElement = this.createComponentCardElement(newComponent);
                                let parent = document.querySelector('.components_list .card_content');
                                let nextSibling = document.getElementById('add-component-dropdown');
                                
                                parent.insertBefore(componentCardElement, nextSibling);
                        }

                        // reset selected index after adding a new component
                        select.value = 0;
                }.bind(this));

                content.appendChild(select);

                card.appendChild(title);
                card.appendChild(content);

                let listNode = document.querySelector(this.project.settings.componentListWrapper);
                listNode.appendChild(card);
        }

        // remove all editor HTML elements for the components
        removeComponentsListElement() {
                let componentsListNode = document.querySelector(this.project.settings.componentListWrapper);
                let i = 0;
                let l = componentsListNode.children.length;

                while (i < l) {
                        componentsListNode.lastElementChild.remove();

                        ++i;
                }
        }

        // create editor HTML element for a component
        createComponentCardElement(component) {
                let wrapper = new HtmlElement('div', null, {class: 'component'});
                // transform components are open by default
                if (component instanceof Transform) {
                        wrapper.classList.add('open');
                }

                // title wrapper
                let title = new HtmlElement('div', null, {class: 'title'});

                // collapse component
                let collapse = new HtmlElement('div', null, {class: 'collapse', title: 'Collapse/Expand this component'});
                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                let collapseIcon = new HtmlElement('i', null, {class: 'fa fa-angle-down'});
                collapse.appendChild(collapseIcon);

                title.appendChild(collapse);

                // component name
                let titleContent = new HtmlElement('div', component.type, {class: 'component_name'});
                title.appendChild(titleContent);

                // component settings dropdown menu
                let dropdown = new HtmlElement('div', null, {class: 'dropdown'});

                let dropdownButton = new HtmlElement('div', null, {class: 'dropdown_button', title: 'Component settings'});

                let icon = new HtmlElement('i', null, {class: 'fa fa-gear'});
                dropdownButton.appendChild(icon);

                dropdown.appendChild(dropdownButton);

                let dropdownContent = new HtmlElement('div', null, {class: 'dropdown_content'});

                if (!(component instanceof Transform)) {
                        // enable / disable component widget
                        let enableComponent = component.attributes['enabled'].createWidget();
                        enableComponent.classList.add('dropdown_content_item');
                        dropdownContent.appendChild(enableComponent);

                        // remove component button
                        // @todo: fix renderer component removal - removed component renderers are still passed to play mode
                        let removeComponent = new HtmlElement('div', null, {class: 'remove_component dropdown_content_item', title: 'Remove this component'});
                        removeComponent.addEventListener('click', function() {
                                component.gameObject.removeComponent(component);
                                wrapper.remove();
                        }.bind(this));

                        let removeText = new HtmlElement('span', 'Remove Component');
                        removeComponent.appendChild(removeText);

                        let removeIcon = new HtmlElement('i', null, {class: 'fa fa-xmark'});
                        removeComponent.appendChild(removeIcon);

                        dropdownContent.appendChild(removeComponent);
                }

                dropdown.appendChild(dropdownContent);
                if (dropdownContent.children.length > 0) {
                        title.appendChild(dropdown);
                }

                // content
                let content = new HtmlElement('div', null, {class: 'content'});

                for (let key in component.attributes) {
                        if (key === 'enabled') {
                                // skip "enabled" attribute because we already added it in the title
                                continue;
                        }

                        if (component.attributes[key] instanceof AttributeText) {
                                content.appendChild(component.attributes[key].createWidget());
                        }
                }

                wrapper.appendChild(title);
                wrapper.appendChild(content);

                return wrapper;
        }

        // TRANSFORM WIDGET
        // @todo: add widget

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

        /* HTML ELEMENTS */
        // dropdown functions
        closeAllDropdowns(tabbar = null) {
                let dropdowns = document.querySelectorAll('.dropdown');

                if (tabbar !== null) {
                        dropdowns = tabbar.querySelectorAll('.dropdown');
                }

                let i = 0;
                let l = dropdowns.length;
                while (i < l) {
                        dropdowns[i].classList.remove('open');

                        ++i;
                }
        }

        /* EVENTS */
        // event handler function
        handleEvent(e) {
                let eventLookup = {
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
                                this.camera.worldPos.subtract(mouseMovement);
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
                let dropdownButton = e.target.closest('.dropdown_button');

                if (dropdownButton !== null) {
                        let closestDropdown = dropdownButton.closest('.dropdown');

                        this.closeAllDropdowns(dropdownButton.closest('.tabbar'));

                        closestDropdown.classList.add('open');
                } else {
                        this.closeAllDropdowns();
                }
        }

        // event function that is called on 'wheel' event on canvas
        onWheel(e) {
                // @todo: fix the scaling !!!
                if (e.wheelDelta > 0) {
                        this.canvasZoom += 0.5;
                } else {
                        this.canvasZoom -= 0.5;
                }

                // clamp zoom
                this.canvasZoom = Math.clamp(this.canvasZoom, 0.5, 1.5);

                this.camera.canvasContext.scale(this.canvasZoom, this.canvasZoom);
        }

        onCurrentGameObjectNameChanged(e) {
                let gameObjectTitle = this.currentGameObjectHTML.querySelector('.title');
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
