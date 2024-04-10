
// import base modules
import { Project } from './project.js';
import { Scene } from './scene.js';
import { Fizzle } from './fizzle.js';
import { RendererEngine } from './renderer_engine.js';
import { Cursor } from './cursor.js';

// import game objects
import { Talisman } from './talismans/talisman.js';

// import collection
import { Vector2 } from './collection/vector2.js';
import { Range } from './collection/range.js';
import { Gizmo } from './editor/gizmo.js';
import { Bounds } from './collection/bounds.js';

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
        // currently selected talisman
        activeTalisman = null;
        // currently selected enchantment
        currentGizmo = null;
        mousemoveAction = null;
        hovering = null;
        // renderer
        renderer;
        // canvas
        canvas;
        canvasContext;
        // grid
        gridColor;
        // canvas zoom
        canvasZoom;
        // ocular
        ocular;
        // mouse controls
        cursor;
        // update cycle for canvas
        animationFrame;
        // html elements
        talismanCollection;
        enchantments;
        actionsDrawer;
        contextMenu;
        positionDisplay;
        zoomDisplay;
        playButton;
        // add new game object options
        availableGameObjects = [
                'Game Object'
        ];
        // add new enchantment options
        availableEnchantments = {
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
                        'Ocular',
                        'Rigidbody',
                        //'Animation'
                ]
        };
        // settings
        settings = {
                'tabbarSelector': new AttributeText('Tabbar Selector', '#editor-tabbar'),
                'canvasSelector': new AttributeText('Canvas Selector', '#gameArea'),
                'displayGrid': new AttributeBoolean('Display Grid', true),
                'gridSize': new AttributeVector2('Grid Size', new Vector2(100, 100))
        };

        constructor() {
                // fetch editor html elements
                this.talismanCollection = document.getElementById('talisman-collection');
                this.enchantments = document.getElementById('enchantments');
                this.actionsDrawer = document.getElementById('actions-drawer');
                this.contextMenu = document.getElementById('context-menu');
                this.positionDisplay = document.getElementById('editor-position');
                this.zoomDisplay = document.getElementById('editor-zoom');
                this.playButton = document.getElementById('editor-play');

                // prepare canvas
                this.canvas = document.getElementById('editor-view');
                this.gridColor = getComputedStyle(document.body).getPropertyValue('--canvas-grid-color');
                // create new project todo: add check if save is found in storage - otherwise load new project
                this.project = new Project();
                this.project.loadScene(this.project.settings['defaultScene']);

                // add a basic renderer
                this.renderer = new RendererEngine();

                // choose first scene in project as current scene
                this.currentScene = this.project.sceneList[0];

                // create cursor class instance for input tracking
                this.cursor = new Cursor();
                this.canvasZoom = 1;

                // ADD EVENT LISTENERS
                document.addEventListener('mousedown', this);
                document.addEventListener('mouseup', this);
                document.addEventListener('mousemove', this);
                document.addEventListener('click', this);
                document.addEventListener('contextmenu', this);
                document.addEventListener('wheel', this);
                document.addEventListener('current_gameObject_name_changed', this);
                document.addEventListener('zoom_changed', this);
                document.addEventListener('position_changed', this);
                document.addEventListener('active_talisman_changed', this);
                // custom events
                window.addEventListener('project_settings_changed', this);

                // prepare editor html
                this.prepareEditorHtml();
        }

        start() {
                // prepare canvas
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.canvasContext = this.canvas.getContext('2d');

                // create new ocular and move it to the center (X:0, Y:0 at the center)
                this.ocular = new Ocular(this.canvas.width, this.canvas.height);
                // this.ocular.worldPos = new Vector2(-this.ocular.canvas.width / 2, -this.ocular.canvas.height / 2);
                this.ocular.worldPos = new Vector2(0, 0);

                this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));
        }

        // process all necessary steps for the current frame
        // e.g. calculations, rendering, etc.
        processFrame() {
                if ((this.currentScene !== null) &&
                    (typeof this.currentScene !== 'undefined'))
                {
                        this.canvas.width = this.canvas.clientWidth;
                        this.canvas.height = this.canvas.clientHeight;

                        // clear canvas and ocular view
                        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.ocular.clear();

                        this.ocular.canvasContext.save();
                        this.ocular.canvasContext.translate(this.canvas.width / 2, this.canvas.height / 2);
                        this.ocular.canvasContext.scale(this.canvasZoom, this.canvasZoom);

                        // process scene frame and draw grid
                        this.processCurrentSceneFrame();
                        if (this.currentGizmo !== null) {
                                this.currentGizmo.renderGizmo(this.ocular);
                        }
                        this.drawGrid();

                        // get view of editor ocular
                        this.canvasContext.drawImage(this.ocular.canvas, 0, 0);

                        this.ocular.canvasContext.scale(1 / this.canvasZoom, 1 / this.canvasZoom);
                        this.ocular.canvasContext.restore();
                }

                // if a gizmo is shown check if the cursor is hovering an interactible part of it
                if ((this.mousemoveAction === null) && (this.currentGizmo !== null)) {
                        let i = 0;
                        const l = this.currentGizmo.gizmos.length;

                        while (i < l) {
                                const gizmo = this.currentGizmo.gizmos[i];

                                // todo: add case for zoomed canvas
                                const zoomedBounds = {};
                                zoomedBounds.bounds = new Bounds(
                                        Math.floor(gizmo.bounds.top / this.canvasZoom + this.canvas.height / 2),
                                        Math.floor(gizmo.bounds.right / this.canvasZoom + this.canvas.width / 2),
                                        Math.floor(gizmo.bounds.bottom / this.canvasZoom + this.canvas.height / 2),
                                        Math.floor(gizmo.bounds.left / this.canvasZoom + this.canvas.width / 2)
                                );
                                if (Fizzle.checkPointInBox(zoomedBounds, this.cursor.position)) {
                                        this.hovering = gizmo;
                                        this.hovering.active = true;
                                }

                                ++i;
                        }
                }

                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        // process frame for current scene
        processCurrentSceneFrame() {
                let i = 0;
                const l = this.currentScene.talismans.length;

                while (i < l) {
                        this.processTalismanFrame(this.currentScene.talismans[i]);

                        ++i;
                }
        }

        // process frame for the passed talisman
        processTalismanFrame(talisman) {
                // skip all disabled talismans
                if (talisman.attributes['enabled'].value === true) {
                        // loop through all enchantments in the current talisman
                        let i = 0;
                        const l = talisman.enchantments.length;

                        while (i < l) {
                                this.processEnchantmentFrame(talisman.enchantments[i]);

                                ++i;
                        }
                }
        }

        // process frame for the passed enchantment
        processEnchantmentFrame(enchantment) {
                // skip all enchantments that are disabled
                if (enchantment.attributes['enabled'].value === true) {
                        // Renderer enchantments
                        if (enchantment instanceof Renderer) {
                                // we need to update the renderer enchantments to get the correct world position
                                enchantment.update();
                                enchantment.render(this.ocular);
                        }

                        if (enchantment instanceof Collider) {
                                enchantment.updateWorldPos();
                        }
                }
        }

        // draw grid
        drawGrid() {
                if (this.settings['displayGrid'].value === true) {
                        this.canvasContext.save();
                        this.canvasContext.lineWidth = 0.5 * this.canvasZoom;
                        this.canvasContext.strokeStyle = this.gridColor;

                        // vertical lines
                        const gridOffsetX = -((this.ocular.worldPos.x - this.canvas.width / 2) % (this.settings['gridSize'].value.x * this.canvasZoom));
                        let x = gridOffsetX;
                        const w = this.canvas.width;
                        while (x < w) {
                                this.canvasContext.beginPath();

                                this.canvasContext.moveTo(x, 0);
                                this.canvasContext.lineTo(x, this.canvas.height);

                                this.canvasContext.stroke();

                                x += this.settings['gridSize'].value.x * this.canvasZoom;
                        }

                        // horizontal lines
                        const gridOffsetY = -((this.ocular.worldPos.y - this.canvas.height / 2) % (this.settings['gridSize'].value.y * this.canvasZoom));
                        let y = gridOffsetY;
                        const h = this.canvas.height;
                        while (y < h) {
                                this.canvasContext.beginPath();

                                this.canvasContext.moveTo(0, y);
                                this.canvasContext.lineTo(this.canvas.width, y);

                                this.canvasContext.stroke();

                                y += this.settings['gridSize'].value.y * this.canvasZoom;
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
                        // new Snackbar('Project successfully loaded from storage.', SNACKBAR_SUCCESS);
                } else {
                        // new Snackbar('No Project in storage. Try saving one first.', SNACKBAR_WARNING);
                }
        }

        // prepare the html for the editor controls
        prepareEditorHtml() {
                this.prepareWelcomeScreen();

                this.prepareEditorUI();

                this.renderTalismanCollection();
        }

        // add events and functionality to all welcome screen elements
        prepareWelcomeScreen() {
                // skip welcome screen entirely
                const welcomeScreen = document.getElementById('welcome-screen');
                const loadingScreen = document.getElementById('loading-screen');

                if ((localStorage.getItem('skip_splash_screen') !== null) && (localStorage.getItem('skip_splash_screen') == 1)) {
                        document.body.removeChild(welcomeScreen);
                        document.body.removeChild(loadingScreen);

                        this.loadProjectFromStorage();
                        this.start();

                        return;
                } else {
                        welcomeScreen.classList.remove('hidden');
                        loadingScreen.classList.remove('hidden');
                }

                // add functionality to buttons on welcome screen
                // start new ritual
                const newRitualButton = document.getElementById('new-ritual');
                if (newRitualButton !== null) {
                        newRitualButton.addEventListener('click', () => {
                                this.start();

                                loadingScreen.classList.remove('hidden');

                                // fade out loading screen and remove its dom element
                                const welcomeAnimation = welcomeScreen.animate({
                                        opacity: 0
                                }, {
                                        duration: 1000,
                                        fill: 'forwards',
                                        easing: 'ease'
                                });
                                welcomeAnimation.addEventListener('finish', function() {
                                        document.body.removeChild(welcomeScreen);
                                });

                                // animate sparkles
                                const sparkles = loadingScreen.querySelectorAll('.sparkle');

                                const startAnimation = (sparkle) => {
                                        const minSize = 20;
                                        const maxSize = 50;
                                        const maxPosition = 500;
                                        const duration = 1500;

                                        const animation = sparkle.animate({
                                                width: (Math.random() * maxSize + minSize) + "px",
                                                left: "calc(50% - " + (Math.random() * maxPosition - (maxPosition / 2)) + "px)",
                                                top: "calc(50% - " + (Math.random() * maxPosition - (maxPosition / 2)) + "px)",
                                        }, {
                                                duration: duration,
                                                easing: 'ease-out',
                                                delay: Math.random() * duration
                                        });

                                        animation.addEventListener('finish', function() {
                                                startAnimation(sparkle)
                                        });
                                }

                                let i = 0;
                                const l = sparkles.length;
                                while (i < l) {
                                        startAnimation(sparkles[i]);

                                        ++i;
                                }

                                // fade out loading screen after 5 seconds and remove it from the DOM
                                window.setTimeout(function() {
                                        const loadingAnimation = loadingScreen.animate({
                                                opacity: 0
                                        }, {
                                                duration: 1000,
                                                fill: 'forwards',
                                                easing: 'ease'
                                        });
                                        loadingAnimation.addEventListener('finish', function() {
                                                document.body.removeChild(loadingScreen);
                                                // localStorage.setItem('skip_splash_screen', 1);
                                        });
                                }, 5000);
                        });
                }

                // load ritual
                const loadRitualButton = document.getElementById('load-ritual');
                if (loadRitualButton !== null) {
                        loadRitualButton.addEventListener('click', () => {
                                this.loadProjectFromStorage();
                                this.start();
                                document.body.removeChild(welcomeScreen);
                                document.body.removeChild(loadingScreen);
                                //localStorage.setItem('skip_splash_screen', 1);
                        });
                }
        }

        // add events to all editor ui elements
        prepareEditorUI() {
                // sidebar
                this.prepareSidebarUI();

                // editor position
                this.positionDisplay.addEventListener('click', function(e) {
                        if (e.target.closest('.fa-arrows-to-dot') !== null) {
                                this.ocular.worldPos = new Vector2();
                                document.dispatchEvent(new Event('position_changed'));
                        }
                }.bind(this));

                // editor zoom
                this.zoomDisplay.addEventListener('click', function(e) {
                        // reset zoom
                        if (e.target.closest('.fa-expand') !== null) {
                                this.canvasZoom = 1;
                                document.dispatchEvent(new Event('zoom_changed'));
                        }

                        // toggle slider by clicking the percentage
                        if (e.target.closest('.value') !== null) {
                                this.zoomDisplay.querySelector('.slider').classList.toggle('hidden');
                        }
                }.bind(this));

                // zoom by using the slider
                const zoomSlider = this.zoomDisplay.querySelector('.slider input');
                zoomSlider.addEventListener('input', function(e) {
                        this.canvasZoom = e.target.value / 100;

                        // clamp zoom
                        this.canvasZoom = Math.clamp(this.canvasZoom, 0.25, 1.75);
                        document.dispatchEvent(new Event('zoom_changed'));
                }.bind(this));

                // play button
                this.playButton.addEventListener('click', function(e) {
                        this.startPlayMode();
                }.bind(this));

                // talisman collection
                this.talismanCollection.addEventListener('click', function(e) {
                        const item = e.target.closest('.item');

                        // toggle children
                        const toggleChildren = e.target.closest('.toggle_children');
                        if (toggleChildren !== null) {
                                item.classList.toggle('open');
                        }

                        // set active
                        const itemName = e.target.closest('.item_name .label');
                        if (itemName !== null) {
                                this.updateTalismanCollection(item);
                        }

                        // visibility
                        const visibility = e.target.closest('.visibility');
                        if (visibility !== null) {
                                item.classList.toggle('invisible');
                        }
                }.bind(this));

                // enchantments
                this.enchantments.addEventListener('click', function(e) {
                        const state = e.target.closest('.state');
                        if (state !== null) {
                                state.closest('.item').classList.toggle('active');
                        } else {
                                const itemTitle = e.target.closest('.title');

                                if (itemTitle !== null) {
                                        const item = itemTitle.closest('.item');

                                        if (item.id !== "name") {
                                                item.classList.toggle('open');
                                        }
                                }
                        }
                });
        }

        // adds click events to all sidebar buttons
        prepareSidebarUI() {
                const sidebar = document.getElementById('sidebar');

                // file
                const fileActionsButton = sidebar.querySelector('.button#file-actions');
                fileActionsButton.addEventListener('click', function(e) {
                        this.clearActionsDrawer();
                        this.updateSidebar(e.target);
                        this.createFileActions();

                }.bind(this));

                // editor
                const editorActionsButton = sidebar.querySelector('.button#editor-actions');
                editorActionsButton.addEventListener('click', function(e) {
                        this.clearActionsDrawer();
                        this.updateSidebar(e.target);
                        this.createEditorActions();

                }.bind(this));

                // scene
                const sceneActionsButton = sidebar.querySelector('.button#scene-actions');
                sceneActionsButton.addEventListener('click', function(e) {
                        this.clearActionsDrawer();
                        this.updateSidebar(e.target);
                        this.createSceneActions();

                }.bind(this));

                // fizzle
                const fizzleActionsButton = sidebar.querySelector('.button#fizzle-actions');
                fizzleActionsButton.addEventListener('click', function(e) {
                        this.clearActionsDrawer();
                        this.updateSidebar(e.target);
                        this.createFizzleActions();

                }.bind(this));

                // renderer
                const rendererActionsButton = sidebar.querySelector('.button#renderer-actions');
                rendererActionsButton.addEventListener('click', function(e) {
                        this.clearActionsDrawer();
                        this.updateSidebar(e.target);
                        this.createRendererActions();

                }.bind(this));

                // dark/light mode
                sidebar.querySelector('.button#night-switch').addEventListener('click', () => {
                        const theme = document.body.dataset.theme;
                        if (theme == "dark") {
                                document.body.dataset.theme = "light";
                        } else if (theme == "light") {
                                document.body.dataset.theme = "dark";
                        }

                        this.gridColor = getComputedStyle(document.body).getPropertyValue('--canvas-grid-color');
                });

                // share
                // todo: add share options in popup - new popup is yet to be designed

                // about
                sidebar.querySelector('.button#about').addEventListener('click', () => {
                        const modal = document.getElementById('about-modal');
                        modal.classList.remove('hidden');
                });
        }

        // populate actions-drawer with file actions
        createFileActions() {
                const actionsList = this.actionsDrawer.querySelector('.content .items');

                // save file
                // save the current project to localStorage
                const saveFileItem = new HtmlElement('div', null, {class: 'item'});
                saveFileItem.addEventListener('click', function() {
                        this.saveProjectToStorage();
                }.bind(this));

                const saveFileIcon = new HtmlElement('i', null, {class: 'fa fa-floppy-disk'});
                const saveFileLabel = new HtmlElement('div', "Save File", {class: 'label'});

                saveFileItem.appendChild(saveFileIcon);
                saveFileItem.appendChild(saveFileLabel);

                actionsList.appendChild(saveFileItem);

                // new file
                // starts a new project (current project will be deleted)
                const newFileItem = new HtmlElement('div', null, {class: 'item'});
                newFileItem.addEventListener('click', function() {
                        console.log("starting new file");
                        // this.resetProject();
                }.bind(this));

                const newFileIcon = new HtmlElement('i', null, {class: 'fa fa-file'});
                const newFileLabel = new HtmlElement('div', "New File", {class: 'label'});

                newFileItem.appendChild(newFileIcon);
                newFileItem.appendChild(newFileLabel);

                actionsList.appendChild(newFileItem);


                // upload file
                // upload a project file to use
                const uploadFileItem = new HtmlElement('label', null, {class: 'item', for: 'load-project-from-file'});

                const upload = new HtmlElement('input', null, {
                        class: 'hidden',
                        type: 'file',
                        accept: 'application/json',
                        id: 'load-project-from-file'
                });
                upload.addEventListener('change', function(e) {
                        const file = e.target.files[0];

                        if (file.type !== 'application/json') {
                                console.warn("Only JSON files are accepted!");
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

                const uploadFileIcon = new HtmlElement('i', null, {class: 'fa fa-upload'});
                const uploadFileLabel = new HtmlElement('div', "Upload File", {class: 'label'});

                uploadFileItem.appendChild(upload);
                uploadFileItem.appendChild(uploadFileIcon);
                uploadFileItem.appendChild(uploadFileLabel);

                actionsList.appendChild(uploadFileItem);


                // download file
                // download the current project as json
                const downloadFileItem = new HtmlElement('div', null, {class: 'item'});
                downloadFileItem.addEventListener('click', function() {
                        const download = new HtmlElement('a', null, {
                                href: 'data:text/json;charset=utf-8,' + encodeURIComponent(this.project.convertToJson()),
                                download: `${this.project.settings['name']}-${Date.now()} .json`
                        });
                        // click link automatically and remove it afterwards
                        download.click();
                        download.remove();
                }.bind(this));

                const downloadFileIcon = new HtmlElement('i', null, {class: 'fa fa-download'});
                const downloadFileLabel = new HtmlElement('div', "Download File", {class: 'label'});

                downloadFileItem.appendChild(downloadFileIcon);
                downloadFileItem.appendChild(downloadFileLabel);

                actionsList.appendChild(downloadFileItem);
        }

        // populate actions-drawer with editor actions
        createEditorActions() {
                const actionsList = this.actionsDrawer.querySelector('.content .items');

                // open editor settings
                const editorSettingsItem = new HtmlElement('div', null, {class: 'item'});
                editorSettingsItem.addEventListener('click', function() {
                        console.log("open editor settings");
                }.bind(this));

                const editorSettingsIcon = new HtmlElement('i', null, {class: 'fa fa-sliders'});
                const editorSettingsLabel = new HtmlElement('div', "Open Editor Settings", {class: 'label'});

                editorSettingsItem.appendChild(editorSettingsIcon);
                editorSettingsItem.appendChild(editorSettingsLabel);

                actionsList.appendChild(editorSettingsItem);
        }

        // populate actions-drawer with scene actions
        createSceneActions() {
                const actionsList = this.actionsDrawer.querySelector('.content .items');

                // open scene settings
                const sceneSettingsItem = new HtmlElement('div', null, {class: 'item'});
                sceneSettingsItem.addEventListener('click', function() {
                        console.log("open scene settings");
                }.bind(this));

                const sceneSettingsIcon = new HtmlElement('i', null, {class: 'fa fa-sliders'});
                const sceneSettingsLabel = new HtmlElement('div', "Open Scene Settings", {class: 'label'});

                sceneSettingsItem.appendChild(sceneSettingsIcon);
                sceneSettingsItem.appendChild(sceneSettingsLabel);

                actionsList.appendChild(sceneSettingsItem);
        }

        // populate actions-drawer with fizzle actions
        createFizzleActions() {
                const actionsList = this.actionsDrawer.querySelector('.content .items');

                // open fizzle settings
                const fizzleSettingsItem = new HtmlElement('div', null, {class: 'item'});
                fizzleSettingsItem.addEventListener('click', function() {
                        console.log("open fizzle settings");
                }.bind(this));

                const fizzleSettingsIcon = new HtmlElement('i', null, {class: 'fa fa-sliders'});
                const fizzleSettingsLabel = new HtmlElement('div', "Open Fizzle Settings", {class: 'label'});

                fizzleSettingsItem.appendChild(fizzleSettingsIcon);
                fizzleSettingsItem.appendChild(fizzleSettingsLabel);

                actionsList.appendChild(fizzleSettingsItem);
        }

        // populate actions-drawer with renderer actions
        createRendererActions() {
                const actionsList = this.actionsDrawer.querySelector('.content .items');

                // open renderer settings
                const rendererSettingsItem = new HtmlElement('div', null, {class: 'item'});
                rendererSettingsItem.addEventListener('click', function() {
                        console.log("open renderer settings");
                }.bind(this));

                const rendererSettingsIcon = new HtmlElement('i', null, {class: 'fa fa-sliders'});
                const rendererSettingsLabel = new HtmlElement('div', "Open Renderer Settings", {class: 'label'});

                rendererSettingsItem.appendChild(rendererSettingsIcon);
                rendererSettingsItem.appendChild(rendererSettingsLabel);

                actionsList.appendChild(rendererSettingsItem);
        }

        // clear all items from actions-drawer
        clearActionsDrawer() {
                const itemsList = this.actionsDrawer.querySelector('.content .items');

                while (itemsList.firstChild) {
                        itemsList.removeChild(itemsList.firstChild);
                }
        }

        // update sidebar and actions drawer state according to clicked button
        updateSidebar(clickedElement) {
                const clickedButton = clickedElement.closest('.button');
                const activeButton = clickedButton.closest('#sidebar').querySelector('.button.active');

                if (activeButton == clickedButton) {
                        clickedButton.classList.remove('active');
                        this.actionsDrawer.classList.remove('open');
                } else {
                        clickedButton.classList.add('active');
                        this.actionsDrawer.classList.add('open');

                        if (activeButton !== null) {
                                activeButton.classList.remove('active');
                        }
                }
        }

        // update talisman collection and enchantments drawer state according to clicked item
        updateTalismanCollection(clickedItem) {
                const activeItem = this.talismanCollection.querySelector('.item.active');

                if (activeItem == clickedItem) {
                        clickedItem.classList.remove('active');
                        this.enchantments.classList.remove('open');
                } else {
                        clickedItem.classList.add('active');
                        this.enchantments.classList.add('open');

                        if (activeItem !== null) {
                                activeItem.classList.remove('active');
                        }
                }
        }

        // display list of talismans in active scene
        renderTalismanCollection() {
                let i = 0;
                const l = this.currentScene.talismans.length;

                while (i < l) {
                        const talisman = this.currentScene.talismans[i];
                        this.renderSingleTalisman(talisman, i);

                        ++i;
                }
        }

        // build a single talisman for the talisman-collection
        renderSingleTalisman(talisman, index = null) {
                const content = this.talismanCollection.querySelector('.content .items');

                if (index == null) {
                        index = this.currentScene.talismans.length - 1;
                }

                const talismanItem = new HtmlElement('div', null, {
                        class: 'item ' + ((talisman.attributes['visible'].value) ? '' : 'invisible'),
                        'data-index': index
                });

                // toggle children (leave out for now)
                /*
                const toggleChildren = new HtmlElement('div', null, {class: 'toggle_children'});

                const caretDown = new HtmlElement('i', null, {class: 'fa fa-caret-down'});
                toggleChildren.appendChild(caretDown);

                const caretRight = new HtmlElement('i', null, {class: 'fa fa-caret-right'});
                toggleChildren.appendChild(caretRight);

                talismanItem.appendChild(toggleChildren);
                */

                // item name
                const itemName = new HtmlElement('div', null, {class: 'item_name'});

                const itemIcon = new HtmlElement('i', null, {class: 'fa ' + talisman.icon});
                itemName.appendChild(itemIcon);

                const itemLabel = new HtmlElement('div', talisman.attributes['name'].value, {class: 'label'});
                itemLabel.addEventListener('click', function() {
                        if (talismanItem.classList.contains('active')) {
                                this.activeTalisman = null;
                                this.currentGizmo = null;
                        } else {
                                this.activeTalisman = talisman;
                                this.currentGizmo = talisman.getEnchantment('Transform');
                        }

                        document.dispatchEvent(new Event('active_talisman_changed'));
                }.bind(this));
                document.addEventListener('talisman_name_changed', function() {
                        itemLabel.innerHTML = talisman.attributes['name'].value;
                });
                itemName.appendChild(itemLabel);

                const itemVisibility = new HtmlElement('div', null, {class: 'visibility'});
                itemVisibility.addEventListener('click', function() {
                        if (talisman.attributes['visible'].value === false) {
                                talisman.attributes['visible'].value = true;
                        } else {
                                talisman.attributes['visible'].value = false;
                        }
                });

                const visible = new HtmlElement('i', null, {class: 'fa fa-eye'});
                itemVisibility.appendChild(visible);
                const invisible = new HtmlElement('i', null, {class: 'fa fa-eye-slash'});
                itemVisibility.appendChild(invisible);

                itemName.appendChild(itemVisibility);


                talismanItem.appendChild(itemName);

                // children (leave out for now)
                /* 
                const children = new HtmlElement('div', null, {class: 'children'});

                talismanItem.appendChild(children);
                */

                content.appendChild(talismanItem);
        }

        // build and display the enchantments for the currently active talisman
        renderEnchantments() {
                const content = this.enchantments.querySelector('.content');

                // talisman name
                const nameItem = new HtmlElement('div', null, {class: 'item ' + ((this.activeTalisman.attributes['enabled'].value) ? 'active' : ''), id: 'name'});

                const nameTitle = new HtmlElement('div', null, {class: 'title'});

                const nameIcon = new HtmlElement('i', null, {class: 'fa fa-signature'});
                nameTitle.appendChild(nameIcon);

                const nameValue = new HtmlElement('div', null, {class: 'value'});
                nameValue.appendChild(this.activeTalisman.attributes['name'].createWidget());
                nameTitle.appendChild(nameValue);

                // enable / disable talisman
                const nameState = new HtmlElement('div', null, {class: 'state'});
                nameState.addEventListener('click', function() {
                        this.activeTalisman.attributes['enabled'].value = !this.activeTalisman.attributes['enabled'].value;
                }.bind(this));

                const nameDisable = new HtmlElement('i', null, {class: 'fa fa-square'});
                nameState.appendChild(nameDisable);
                const nameEnable = new HtmlElement('i', null, {class: 'fa fa-square-check'});
                nameState.appendChild(nameEnable);

                nameTitle.appendChild(nameState);

                nameItem.appendChild(nameTitle);
                content.appendChild(nameItem);


                // talisman enchantments
                let i = 0;
                const l = this.activeTalisman.enchantments.length;

                while (i < l) {
                        const enchantment = this.activeTalisman.enchantments[i];

                        // have Transform enchantments open by default
                        let open = false;
                        let allowDisable = true;
                        if (enchantment.type == "Transform") {
                                open = true;
                                allowDisable = false;
                        }

                        const item = this.renderSingleEnchantment(enchantment, i, open, allowDisable);

                        content.appendChild(item);

                        ++i;
                }
        }

        // build a single enchantment for the enchantments container
        renderSingleEnchantment(enchantment, index = null, open = false, allowDisable = true) {
                const item = new HtmlElement('div', null, {
                        class: 'item ' + ((enchantment.attributes['enabled'].value) ? 'active ' : '') + ((open) ? 'open' : ''),
                        'data-index': index
                });

                // title
                const title = new HtmlElement('div', null, {class: 'title'});
                const icon = new HtmlElement('i', null, {class: 'fa ' + enchantment.icon});
                title.appendChild(icon);

                const label = new HtmlElement('div', enchantment.type, {class: 'label'});
                title.appendChild(label);

                // enable / disable enchantment
                if (allowDisable === true) {
                        const status = new HtmlElement('div', null, {class: 'state'});
                        status.addEventListener('click', () => {
                                enchantment.attributes['enabled'].value = !enchantment.attributes['enabled'].value;
                        });

                        const disable = new HtmlElement('i', null, {class: 'fa fa-square-check'});
                        status.appendChild(disable);

                        const enable = new HtmlElement('i', null, {class: 'fa fa-square'});
                        status.appendChild(enable);

                        title.appendChild(status);
                }

                item.appendChild(title);

                // properties
                const properties = new HtmlElement('div', null, {class: 'properties'});
                for (let key in enchantment.attributes) {
                        if (key !== 'enabled') {
                                // skip 'enabled' attribute because we already added it in the title

                                if (enchantment.attributes[key] instanceof AttributeText) {
                                        const widget = enchantment.attributes[key].createWidget();

                                        properties.appendChild(widget);
                                }
                        }
                }

                item.appendChild(properties);

                return item;
        }

        // clear enchantments - called after changing active talisman
        clearEnchantments() {
                const content = this.enchantments.querySelector('.content');

                while (content.firstChild) {
                        content.removeChild(content.firstChild);
                }
        }

        // show context menu at position x, y
        showContextMenu(x, y) {
                // un-hide context menu and move to clicked position
                this.contextMenu.classList.remove('hidden');
                this.contextMenu.style.left = `${x}px`;
                this.contextMenu.style.top = `${y}px`;

                // re-calculate position and adjust to keep bounds inside screen
                const rightBorder = this.contextMenu.offsetLeft + this.contextMenu.clientWidth;
                const rightOverlap = document.body.clientWidth - rightBorder;
                if (rightOverlap < 0) {
                        x += rightOverlap - 10;
                }

                const bottomBorder = this.contextMenu.offsetTop + this.contextMenu.clientHeight;
                const bottomOverlap = document.body.clientHeight - bottomBorder;
                if (bottomOverlap < 0){
                        y += bottomOverlap - 10;
                }

                this.contextMenu.style.left = `${x}px`;
                this.contextMenu.style.top = `${y}px`;
        }

        // hide context menu
        hideContextMenu() {
                this.contextMenu.classList.add('hidden');
        }

        // clear options from context menu
        clearContextMenu() {
                while (this.contextMenu.firstChild) {
                        this.contextMenu.removeChild(this.contextMenu.firstChild);
                }
        }

        // build context menu for talismans
        renderTalismanContextMenu(talisman = null) {
                if (talisman == null) {
                        // create new talisman
                        const createTalisman = new HtmlElement('div', "Create new Talisman", { class: 'option' });
                        createTalisman.addEventListener('click', function() {
                                const newTalisman = new Talisman();

                                this.currentScene.addTalisman(newTalisman);
                                this.renderSingleTalisman(newTalisman);

                                this.hideContextMenu();
                        }.bind(this));

                        this.contextMenu.appendChild(createTalisman);

                        // other options

                } else {
                        // destroy this talisman
                        const destroyTalisman = new HtmlElement('div', "Destroy this Talisman", { class: 'option' });
                        destroyTalisman.addEventListener('click', function() {
                                console.log("destroying talisman...");
                                this.hideContextMenu();
                        }.bind(this));

                        this.contextMenu.appendChild(destroyTalisman);

                        // other options

                }
        }

        // build context menu for editor view
        renderEditorContextMenu() {
                // todo: add context menu options
        }

        // build context menu for enchantments
        renderEnchantmentContextMenu(enchantment = null) {
                if (enchantment == null) {
                        // add new enchantment menu
                        const addEnchantment = new HtmlElement('div', null, { class: 'menu' });
                        addEnchantment.addEventListener('click', function() {
                                addEnchantment.classList.add('open');
                        });

                        const menuTitle = new HtmlElement('span', "Add new Enchantment");
                        addEnchantment.appendChild(menuTitle);

                        // enchantments menu tree
                        const tree = new HtmlElement('div', null, {class: 'tree'});

                        for (const key in this.availableEnchantments) {
                                const branchItem = this.availableEnchantments[key];

                                const branch = new HtmlElement('div', null, {class: 'branch'});

                                // branch title
                                const branchTitle = new HtmlElement('div', null, {class: 'title'});
                                branchTitle.addEventListener('click', function() {
                                        branch.classList.add('open');
                                        tree.classList.add('open');
                                });

                                const titleText = new HtmlElement('span', key);
                                const titleIcon = new HtmlElement('i', null, {class: 'fa fa-chevron-right'});

                                branchTitle.appendChild(titleText);
                                branchTitle.appendChild(titleIcon);

                                branch.appendChild(branchTitle);

                                // branch children
                                const branchBack = new HtmlElement('div', null, {class: 'leaf back'});
                                branchBack.addEventListener('click', function() {
                                        branch.classList.remove('open');
                                        tree.classList.remove('open');
                                });

                                const backIcon = new HtmlElement('i', null, {class: 'fa fa-chevron-left'});
                                const backText = new HtmlElement('span', 'Back');

                                branchBack.appendChild(backIcon);
                                branchBack.appendChild(backText);

                                branch.appendChild(branchBack);

                                // add leaves
                                let i = 0;
                                const l = branchItem.length;

                                while (i < l) {
                                        const leafItem = branchItem[i];
                                        const leafEnchantment = eval(`new ${leafItem.replace(' ', '')}()`);

                                        const leaf = new HtmlElement('div', null, {class: 'leaf'});
                                        leaf.addEventListener('click', function() {
                                                this.activeTalisman.addEnchantment(leafEnchantment);

                                                const content = this.enchantments.querySelector('.content');
                                                const item = this.renderSingleEnchantment(leafEnchantment, this.activeTalisman.enchantments.length - 1, true);
                                                content.appendChild(item);

                                                // close tree and hide context menu
                                                branch.classList.remove('open');
                                                tree.classList.remove('open');
                                                addEnchantment.classList.remove('open');

                                                this.hideContextMenu();
                                        }.bind(this));

                                        // enchantment icon
                                        const leafIcon = new HtmlElement('i', null, { class: 'fa ' + leafEnchantment.icon});
                                        leaf.appendChild(leafIcon);

                                        // enchantment name
                                        const leafTitle = new HtmlElement('span', leafItem);
                                        leaf.appendChild(leafTitle);

                                        branch.appendChild(leaf);

                                        ++i;
                                }

                                tree.appendChild(branch);
                        }

                        addEnchantment.appendChild(tree);

                        this.contextMenu.appendChild(addEnchantment);

                        // other option

                } else {
                        // remove this enchantment
                        if (enchantment.type !== "Transform") {
                                const removeEnchantment = new HtmlElement('div', "Remove this Enchantment", { class: 'option' });
                                removeEnchantment.addEventListener('click', function() {
                                        console.log("removing enchantment...");
                                        this.hideContextMenu();
                                }.bind(this));

                                this.contextMenu.appendChild(removeEnchantment);
                        }

                        // reset values
                        const resetEnchantment = new HtmlElement('div', "Reset Enchantment values", { class: 'option' });
                        resetEnchantment.addEventListener('click', function() {
                                enchantment.resetAttributes();

                                this.hideContextMenu();
                        }.bind(this));

                        this.contextMenu.appendChild(resetEnchantment);
                }
        }

        // == CUSTOM HTML BUTTON ELEMENTS ==   (deprecated - keeping it for now to move to new buttons later)
        // create editor HTML element for opening the project settings popup
        createEditorSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'editor-settings-form'});

                // create widgets for all attributes
                for (let key in this.settings) {
                        const widget = this.settings[key].createWidget();

                        form.appendChild(widget);
                }

                return form;
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
        createRendererSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'renderer-settings-form'});

                // create an input field for each setting
                for (let key in this.project.rendererEngine.settings) {
                        const widget = this.project.rendererEngine.settings[key].createWidget();

                        form.appendChild(widget);
                }

                return form;
        }

        createPhysicsSettingsForm() {
                const form = new HtmlElement('form', null, {id: 'physics-settings-form'});

                // create widgets for all attributes
                for (let key in this.project.fizzle.attributes) {
                        const widget = this.project.fizzle.attributes[key].createWidget();

                        form.appendChild(widget);
                }

                return form;
        }

        // opens the current project in a new tab for play testing
        startPlayMode() {
                this.saveProjectToStorage();

                const currentUrl = window.location.origin + window.location.pathname;
                window.open(currentUrl.replace('editor', 'player'), '_blank').focus();
        }

        // == EVENTS ==
        // event handler function
        handleEvent(e) {
                const eventLookup = {
                        project_settings_changed: function(e) {
                                this.onProjectSettingsChanged(e);
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
                        contextmenu: function(e) {
                                this.onContextMenu(e);
                        }.bind(this),
                        wheel: function(e) {
                                this.onWheel(e);
                        }.bind(this),
                        position_changed: function(e) {
                                this.onPositionChanged(e);
                        }.bind(this),
                        zoom_changed: function(e) {
                                this.onZoomChanged(e);
                        }.bind(this),
                        active_talisman_changed: function(e) {
                                this.onActiveTalismanChanged(e)
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
                                this.mousemoveAction = e.target.closest('.popup');
                        }

                        // if something in the canvas is being clicked
                        if (e.target.closest('#editor-view') !== null) {
                                this.cursor.leftClick = true;
                                this.cursor.leftClickDownPos = new Vector2(e.clientX, e.clientY);

                                if (this.hovering !== null) {
                                        this.mousemoveAction = this.hovering;
                                }
                        }
                } else if (e.which == 2) {
                        // if editor canvas has been clicked - move ocular
                        if (e.target.closest('#editor-view') !== null) {
                                this.cursor.wheelClick = true;
                                this.cursor.wheelClickDownPos = new Vector2(e.clientX, e.clientY);

                                this.mousemoveAction = this.canvas;
                        }
                } else if (e.which == 3) {
                        if (e.target.closest('#editor-view') !== null) {
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
                } else if (e.which == 2) {
                        this.cursor.wheelClick = false;
                        this.cursor.wheelClickUpPos = new Vector2(e.clientX, e.clientY);
                } else if (e.which == 3) {
                        this.cursor.rightClick = false;
                        this.cursor.rightClickUpPos = new Vector2(e.clientX, e.clientY);
                }

                this.mousemoveAction = null;
        }

        onContextMenu(e) {
                e.preventDefault();

                // context menu on talisman-collection
                if (e.target.closest('#talisman-collection') !== null) {
                        let talisman = null;
                        // check if a talisman has been clicked
                        const clickedTalisman = e.target.closest('.item');
                        if (clickedTalisman !== null) {
                                const index = clickedTalisman.dataset.index;

                                if (index != 0) {
                                        talisman = this.currentScene.talismans[index];
                                }
                        }

                        this.clearContextMenu();
                        this.renderTalismanContextMenu(talisman);

                        this.showContextMenu(e.clientX, e.clientY);
                }

                // context menu on editor-view
                if (e.target.closest('#editor-view') !== null) {
                        this.clearContextMenu();
                        this.renderEditorContextMenu();

                        this.showContextMenu(e.clientX, e.clientY);
                }

                // context menu on enchantments
                if (e.target.closest('#enchantments') !== null) {
                        let enchantment = null;
                        // check if an enchantment has been clicked
                        const clickedEnchantment = e.target.closest('.item:not(#name)');
                        if (clickedEnchantment !== null) {
                                enchantment = this.activeTalisman.enchantments[clickedEnchantment.dataset.index];
                        }

                        this.clearContextMenu();
                        this.renderEnchantmentContextMenu(enchantment);

                        this.showContextMenu(e.clientX, e.clientY);
                }
        }

        // event function that is called on 'mousemove' event on canvas
        onMousemove(e) {
                if (e.target === document) {
                        return;
                }

                if ((e.target.closest('#editor-view') !== null) && (typeof this.ocular !== "undefined")) {
                        const x = e.clientX - this.canvas.offsetLeft + this.ocular.worldPos.x;
                        const y = e.clientY - this.canvas.offsetTop + this.ocular.worldPos.y;
                        this.cursor.position = new Vector2(x, y);
                }

                // move editor view
                if (this.mousemoveAction === this.canvas) {
                        let mouseMovement = new Vector2(e.movementX / this.canvasZoom, e.movementY / this.canvasZoom);
                        this.ocular.worldPos = Vector2.subtract(this.ocular.worldPos, mouseMovement);

                        document.dispatchEvent(new Event('position_changed'));

                        return;
                }

                // move popup (or any other htmlElement)
                if (this.mousemoveAction instanceof HTMLElement) {
                        this.mousemoveAction.style.top = this.mousemoveAction.offsetTop + e.movementY + 'px';
                        this.mousemoveAction.style.left = this.mousemoveAction.offsetLeft + e.movementX + 'px';

                        return;
                }

                // gizmo is being held and moved -> change value
                if (this.mousemoveAction instanceof Gizmo) {
                        this.mousemoveAction.change(new Vector2(e.movementX / this.canvasZoom, e.movementY / this.canvasZoom));

                        return;
                }
        }

        // event function that is called on 'click' event on document
        onClick(e) {
                // close modal
                const closeButton = e.target.closest('.modal .close');
                if (closeButton !== null) {
                        e.target.closest('.modal').classList.add('hidden');
                }

                // hide context menu
                if (!this.contextMenu.classList.contains('hidden') && (e.target.closest('#context-menu') === null)) {
                        this.hideContextMenu();
                }
        }

        // event function that is called on 'wheel' event on canvas
        onWheel(e) {
                if (e.target.closest('canvas') !== null) {
                        if (e.wheelDelta > 0) {
                                this.canvasZoom += 0.025;
                        } else {
                                this.canvasZoom -= 0.025;
                        }

                        // clamp zoom
                        this.canvasZoom = Math.clamp(this.canvasZoom, 0.25, 1.75);
                        document.dispatchEvent(new Event('zoom_changed'));
                }
        }

        onPositionChanged(e) {
                const positionDisplayLabel = this.positionDisplay.querySelector('.value');
                positionDisplayLabel.innerHTML = Math.floor(this.ocular.worldPos.x) + " • " + Math.floor(this.ocular.worldPos.y);
        }

        onZoomChanged(e) {
                const zoomDisplayLabel = this.zoomDisplay.querySelector('.value');
                zoomDisplayLabel.innerHTML = Math.round(this.canvasZoom * 100) + "%";

                const zoomDisplaySlider = this.zoomDisplay.querySelector('.slider input');
                zoomDisplaySlider.value = this.canvasZoom * 100;
        }

        onActiveTalismanChanged(e) {
                this.clearEnchantments();

                if (this.activeTalisman !== null) {
                        this.renderEnchantments();
                }
        }
}
