
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
        // current game object
        currentGameObject;
        // renderer
        renderer;
        // canvas
        canvas;
        canvasContext;
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
                tabbarSelector: '#editor-tabbar',
                canvasSelector: '#gameArea'
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
                this.tabbar = new Tabbar(this.settings.tabbarSelector);
                // file options tab
                this.tabbar.addTab('tab-file', 'File', 'file', true);
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createUploadProjectFileButton());
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createLoadStorageButton());
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createDownloadProjectButton());
                this.tabbar.tabs['tab-file'].addDropdownItem(this.createSaveStorageButton());
                // project options tab
                this.tabbar.addTab('tab-project', 'Project', 'box-archive', true);
                this.tabbar.tabs['tab-project'].addDropdownItem(this.createOpenProjectSettingsButton());
                // scene options tab
                //this.tabbar.addTab('tab-scene', 'Scene', 'mountain-sun');
                // build settings tab
                //this.tabbar.addTab('tab-build_settings', 'Build Settings', 'toolbox');
                // about tab
                this.tabbar.addTab('tab-about', 'About', 'circle-question', false, TABBAR_POSITION_END);
                this.tabbar.tabs['tab-about'].html.addEventListener('click', function() {
                        new Popup('About', this.createAboutPopupContent(), 'about_popup')
                }.bind(this));
                // share project tab
                this.tabbar.addTab('tab-share', 'Share', 'share-nodes', false);
                this.tabbar.tabs['tab-share'].html.addEventListener('click', function() {
                        new Snackbar('Sharing projects is not implemented yet!', SNACKBAR_WARNING);
                });

                // play button
                document.body.appendChild(this.createPlayButton());

                // build editor object
                // prepare canvas
                this.canvas = document.querySelector(this.settings.canvasSelector);
                // create new project @todo: add check if save is found in storage - otherwise load new project
                this.project = new Project();

                // add a basic renderer
                this.renderer = new Renderer();

                // choose first scene in project as current scene
                this.currentScene = this.project.sceneList[0];
                this.currentGameObject = null;

                // create cursor class instance for input tracking
                this.cursor = new Cursor();

                // set canvas background color from project settings
                this.canvas.style.backgroundColor = this.project.settings['canvasBackgroundColor'];

                // ADD EVENT LISTENERS
                document.addEventListener('mousedown', this);
                document.addEventListener('mouseup', this);
                document.addEventListener('mousemove', this);
                document.addEventListener('click', this);
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

                        // draw grid - @todo: add configurable grid size

                        let i = 0;
                        let l = this.currentScene.gameObjects.length;
                        // loop through all gameObjects in the current scene
                        while (i < l) {
                                if (this.currentScene.gameObjects[i].attributes['enabled'].value === true) {
                                        let j = 0;
                                        let c = this.currentScene.gameObjects[i].components.length;
                                        // loop through all components in the current gameObject
                                        while (j < c) {
                                                // only render component renderer components if they are enabled
                                                if (this.currentScene.gameObjects[i].components[j].attributes['enabled'].value === true) {
                                                        // render component renderer components
                                                        if (this.currentScene.gameObjects[i].components[j] instanceof ComponentRenderer) {
                                                                this.currentScene.gameObjects[i].components[j].render(this.camera);
                                                        }
                                                }

                                                ++j;
                                        }

                                        // @todo: add check if the gameObject is selected - otherwise don't show gizmo
                                        if (this.currentScene.gameObjects[i] === this.currentGameObject) {
                                                // always render transform components last!
                                                // show gizmo for transform components
                                                // up arrow
                                                let upArrow = new TransformUpArrowGizmo(this.currentScene.gameObjects[i].transform);
                                                upArrow.render(this.camera);
                                                // right arrow
                                                let rightArrow = new TransformRightArrowGizmo(this.currentScene.gameObjects[i].transform);
                                                rightArrow.render(this.camera);
                                                // center box
                                                let centerBox = new TransformCenterBoxGizmo(this.currentScene.gameObjects[i].transform);
                                                centerBox.render(this.camera);
                                        }
                                }

                                ++i;
                        }

                        // draw editor grid
                        
                        // get view of editor camera
                        this.camera.update();
                        this.canvasContext.drawImage(this.camera.canvas, 0, 0);
                }

                window.requestAnimationFrame(this.processFrame.bind(this));
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

        // create editor HTML element the about popup
        createAboutPopupContent() {
                let wrapper = new HtmlElement('div', null, {});

                let engineName = new HtmlElement('div', 'JS 2D-Engine', {class: 'engine_name mt_10 text_bold text_center'});
                wrapper.appendChild(engineName);

                let version = new HtmlElement('div', 'v1.0a', {class: 'version text_center'});
                wrapper.appendChild(version);

                let infoText = new HtmlElement('div', 'This engine is open source and free to use.<br>Please report any that try to sell this software!<br><br>Feel free to experiment with the different components and this editor!<br>Thank you for using my software!', {class: 'engine_info mx_20 text_center'});
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
                        } else {
                                thisElement.classList.remove('selected');
                                this.removeComponentsListElement();
                                this.currentGameObject = null;
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
                let select = new HtmlElement('select', 'Adds a new component to the selected GameObject', {class: 'add_component'});

                let defaultOption = new HtmlElement('option', '&#x2b; Add New Component', {value: 0});

                select.appendChild(defaultOption);

                let j = 0;
                let ac = this.availableComponents.length;
                while (j < ac) {
                        let option = new HtmlElement('option', this.availableComponents[j], {value: this.availableComponents[j]});

                        select.appendChild(option);

                        ++j;
                }
                
                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
                        if (selectedOption !== 0) {
                                let newComponent = eval(`new ${selectedOption.replace(' ', '')}()`);

                                gameObject.addComponent(newComponent);
                        }

                        this.removeComponentsListElement();
                        this.createComponentsListElement(gameObject);
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

                let title = new HtmlElement('div', null, {class: 'title'});

                let titleContent = new HtmlElement('div', component.type, {class: 'component_name'});

                let collapse = new HtmlElement('div', '&#10095;', {class: 'collapse', title: 'Collapse/Expand this component'});
                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                title.appendChild(titleContent);
                if (!(component instanceof Transform)) {
                        // can't disable transform components!
                        title.appendChild(component.attributes['enabled'].createWidget());
                }

                title.appendChild(collapse);

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
                        default: function(e) {
                                console.warn(`Unexpected event: ${e.type}`);
                        }.bind(this)
                };

                return (eventLookup[e.type] || eventLookup['default'])(e);
        }
        
        // event function that is called on 'mousedown' event on canvas
        onMousedown(e) {
                if (e.which == 1) {
                        // if editor canvas has been clicked - move camera
                        if (e.target.closest(this.settings.canvasSelector) !== null) {
                                this.cursor.leftClick = true;
                                this.cursor.leftClickDownPos = new Vector2(e.clientX, e.clientY);
                        }

                        // if a popup title has been clicked - move popup
                        if (e.target.closest('.popup_title') !== null) {
                                this.movePopup = e.target.closest('.popup');
                        }
                } else if (e.which == 3) {
                        if (e.target.closest(this.settings.canvasSelector) !== null) {
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
                } else if (e.which == 3) {
                        this.cursor.rightClick = false;
                        this.cursor.rightClickUpPos = new Vector2(e.clientX, e.clientY);
                }
        }

        // event function that is called on 'mousemove' event on canvas
        onMousemove(e) {
                // check if the cursor is hovering a gizmo
                // @todo: add functionality
                if (e.target.closest(this.settings.canvasSelector) !== null) {
                        this.hovering = this.canvas;
                }

                // if no gizmo is being hovered and the left button is being held down, move the camera
                if ((this.cursor.leftClick === true) &&
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

        // event function that is called on custom 'scene_ist_changed' event on the window
        onScenelistchanged(e) {
                console.log(`Event '${e.type}' occurred!`);

                this.reloadEditorElements();
        }

        // event function that is called on custom 'project_settings_changed' event on the window
        onProjectsettingschanged(e) {
                console.log(`Event '${e.type}' occurred!`);

                // for now update canvas color
                this.canvas.style.backgroundColor = this.project.settings['canvasBackgroundColor'];
        }
}