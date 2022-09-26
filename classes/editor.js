
class Editor {
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
        availableGameObjects = [];
        // add new component options
        availableComponents = [];
        // settings
        settings = {
                tabbarSelector: '#editor-tabbar',
                canvasSelector: '#gameArea'
        };
        // mouse controls
        cursor;
        // update cycle for canvas
        animationFrame;

        constructor() {
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
                this.canvas.addEventListener('mousedown', this);
                this.canvas.addEventListener('mouseup', this);
                document.addEventListener('mousemove', this);
                document.addEventListener('click', this);
                // custom events
                window.addEventListener('project_settings_changed', this);
                window.addEventListener('scene_list_changed', this);
        }

        start() {
                this.loadEditorTabbar();
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
                localStorage.setItem('project', this.projectToJson());
        }

        // load a project from the localStorage
        loadProjectFromStorage() {
                let json = localStorage.getItem('project');

                if ((json !== null) &&
                    (typeof json !== 'undefined'))
                {
                        this.jsonToProject(json);
                } else {
                        console.log('No Project in storage. Try saving one first.');
                }
        }

        /* JSON IMPORT */
        // turn a passed json object into a project object
        jsonToProject(json) {
                // @todo: this is ugly - split each loop into its own function for readability and to reduce complexity from the ide
                let dummy = JSON.parse(json);

                let project = new Project();
                project.settings = dummy.settings;

                project.sceneList = this.jsonToSceneList(dummy);

                this.project = project;

                this.reloadEditorElements();
        }

        // create an array of a scenes using a given dummy (json) project object
        jsonToSceneList(dummyProject) {
                let sceneList = [];
                console.log(dummyProject);
                let i = 0;
                let l = dummyProject.sceneList.length;
                while (i < l) {
                        let scene = new Scene();
                        scene.settings = dummyProject.sceneList[i].settings;

                        scene.gameObjects = this.jsonToGameObjectsList(dummyProject.sceneList[i]);

                        sceneList.push(scene);

                        ++i;
                }

                return sceneList;
        }

        // create an array of a game objects using a given dummy (json) scene object
        jsonToGameObjectsList(dummyScene) {
                let gameObjectsList = [];

                let i = 0;
                let l = dummyScene.gameObjects.length;
                while (i < l) {
                        let gameObject = new GameObject();

                        gameObject.attributes = this.jsonToGameObjectAttributesList(dummyScene.gameObjects[i], gameObject);
                        gameObject.components = this.jsonToComponentsList(dummyScene.gameObjects[i], gameObject);

                        gameObjectsList.push(gameObject);

                        ++i;
                }

                return gameObjectsList;
        }

        // create an array of a game object's attributes using a given dummy (json) game object
        jsonToGameObjectAttributesList(dummyObject, gameObject) {
                let attributesList = [];

                for (let key in gameObject.attributes) {
                        let dummyAttribute = dummyObject.attributes[key];

                        if (!(dummyAttribute instanceof Object) || (dummyAttribute instanceof Array)) {
                                attributesList[key] = dummyAttribute;

                                continue;
                        }

                        attributesList[key].name = dummyAttribute.name;

                        if (dummyAttribute.value instanceof Object) {
                                attributesList[key].value = new Vector2(dummyAttribute.value.x, dummyAttribute.value.y);
                        } else {
                                attributesList[key].value = dummyAttribute.value;
                        }

                        attribute.gameObject = gameObject;

                        attributesList.push(attribute);
                }

                return attributesList;
        }

        // create an array of a game object's components using a given dummy (json) game object
        jsonToComponentsList(dummyObject, gameObject) {
                let componentsList = [];

                let i = 0;
                let l = dummyObject.components.length;
                while (i < l) {
                        let type = dummyObject.components[i].type;
                        type = type.replace(/\s+/g, '');

                        let component = eval(`new ${type}()`);

                        for (let key in dummyObject.components[i].attributes) {
                                let dummyAttribute = dummyObject.components[i].attributes[key];

                                if (!(dummyAttribute instanceof Object) || dummyAttribute instanceof Array) {
                                        component.attributes[key] = dummyAttribute;

                                        continue;
                                }

                                component.attributes[key].name = dummyAttribute.name;

                                if (dummyAttribute.value instanceof Object) {
                                        component.attributes[key].value = new Vector2(dummyAttribute.value.x, dummyAttribute.value.y);
                                } else {
                                        component.attributes[key].value = dummyAttribute.value;
                                }
                        }

                        component.gameObject = gameObject;
                        componentsList.push(component);

                        ++i;
                }

                return componentsList;
        }

        /* JSON EXPORT */
        // turn current project object into a json object
        projectToJson() {
                let dummy = this.prepareProjectForJsonExport(this.project);
                let json = JSON.stringify(dummy);

                return json;
        }

        // prepare a project object for json export
        prepareProjectForJsonExport(project) {
                let dummy = {};

                // project settings
                dummy.settings = {};
                for (let key in project.settings) {
                        dummy.settings[key] = project.settings[key];
                }

                // project active scene
                dummy.activeScene = project.settings['defaultScene'];

                // project scene list
                dummy.sceneList = [];

                let i = 0;
                let l = project.sceneList.length;
                while (i < l) {
                        dummy.sceneList[i] = this.prepareSceneForJsonExport(project.sceneList[i]);

                        ++i;
                }

                let json = JSON.stringify(dummy);

                return json;
        }

        // prepare a scene object for the json export
        prepareSceneForJsonExport(scene) {
                let dummy = {};

                // scene settings
                dummy.settings = {};
                for (let key in scene.settings) {
                        if ((key !== 'remove') &&
                            (key !== 'clear'))
                        {
                                dummy.settings[key] = scene.settings[key];
                        }
                }

                // scene active camera
                dummy.activeCamera = [];
                dummy.activeCamera[0] = {};
                dummy.activeCamera[0].name 

                // scene game objects
                dummy.gameObjects = [];

                let i = 0;
                let l = scene.gameObjects.length;
                while (i < l) {
                        dummy.gameObjects[i] = this.prepareGameObjectForJsonExport(scene.gameObjects[i]);

                        ++i;
                }

                return dummy;
        }

        // prepare a gameObject for the json export
        prepareGameObjectForJsonExport(gameObject) {
                let dummy = {};

                // game object attributes
                dummy.attributes = {};

                for (let key in gameObject.attributes) {
                        if ((key === 'remove') ||
                                (key === 'clear'))
                        {
                                continue;
                        }

                        dummy.attributes[key] = {};

                        dummy.attributes[key].type = gameObject.attributes[key].type;
                        dummy.attributes[key].name = gameObject.attributes[key].name;
                        dummy.attributes[key].value = gameObject.attributes[key].value;
                }

                // game object components
                dummy.components = [];

                let i = 0;
                let l = gameObject.components.length;
                while (i < l) {
                        dummy.components[i] = this.prepareComponentForJsonExport(gameObject.components[i]);

                        ++i;
                }

                return dummy;
        }

        // prepare a component for the json export
        prepareComponentForJsonExport(component) {
                let dummy = {};

                dummy.type = component.type;
                dummy.attributes = {};

                // component attributes
                for (let key in component.attributes) {
                        if ((key === 'remove') ||
                            (key === 'clear'))
                        {
                                continue;
                        }

                        if (!(component.attributes[key] instanceof AttributeText)) {
                                dummy.attributes[key] = component.attributes[key];

                                continue;
                        }

                        dummy.attributes[key] = {};

                        dummy.attributes[key].name = component.attributes[key].name;
                        dummy.attributes[key].value = component.attributes[key].value;
                }

                return dummy;
        }

        /* HTML EDITOR ELEMENTS */

        // TABBAR
        // create editor HTML Element for loading a project from an uploaded file
        createFileToProjectElement() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('dropdown_content_item', 'upload_file');

                // create file input element
                let input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'application/json');
                input.classList.add('content', 'hidden');
                input.id = 'load-project-from-file';
                input.addEventListener('change', function(e) {
                        let file = e.target.files[0];

                        if (file.type !== 'application/json') {
                                console.log("only .json files are accepted!");
                                return false;
                        }

                        let reader = new FileReader();

                        reader.addEventListener('load', function() {
                                this.jsonToProject(reader.result);
                        }.bind(this));

                        if (file) {
                                reader.readAsText(file);
                        }
                }.bind(this));

                // create label for input element
                let label = document.createElement('label');
                label.classList.add('button_link');
                label.innerHTML = 'Load Project From File';
                label.title = 'Upload a JSON file to import a project';
                label.setAttribute('for', input.id);

                // add font awesome icon
                let icon = document.createElement('i');
                icon.classList.add('fa', 'fa-file-export');

                label.prepend(icon);

                wrapper.appendChild(input);
                wrapper.appendChild(label);

                return wrapper;
        }

        // create editor HTML element for turning the current project into a .json file and downloading it
        createDownloadProjectElement() {
                let fileDownload = document.createElement('div');
                fileDownload.classList.add('dropdown_content_item', 'download_file');

                // create fake link
                let label = document.createElement('div');
                label.classList.add('button_link');
                label.innerHTML = 'Save Project As File';
                label.title = 'Export the project as a JSON file';
                label.addEventListener('click', function() {
                        // create invisible link element when clicked
                        let link = document.createElement('a');
                        link.classList.add('button_link');
                        // create json file from current project
                        link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.projectToJson()));
                        link.setAttribute('download', `${this.project.settings['name']}-${Date.now()} .json`);
                        // click link automatically
                        link.click();

                        link.remove();
                }.bind(this));

                // add font awesome icon
                let icon = document.createElement('i');
                icon.classList.add('fa', 'fa-file-import');

                label.prepend(icon);
                fileDownload.appendChild(label);

                return fileDownload;
        }

        // create editor HTML element for saving the current project in the localStorage
        createSaveStorageElement() {
                let saveStorage = document.createElement('div');
                saveStorage.classList.add('dropdown_content_item', 'save_storage');

                // create link
                let link = document.createElement('a');
                link.classList.add('button_link');
                link.innerHTML = 'Save Project To Storage';
                link.title = "Save the project to the browser's local storage";
                link.addEventListener('click', function() {
                        this.saveProjectToStorage();
                }.bind(this));

                // add font awesome icon
                let icon = document.createElement('i');
                icon.classList.add('fa', 'fa-download');

                link.prepend(icon);
                saveStorage.appendChild(link);

                return saveStorage;
        }

        // create editor HTML element for loading a project from the localStorage
        createLoadStorageElement() {
                let loadStorage = document.createElement('div');
                loadStorage.classList.add('dropdown_content_item', 'save_storage');

                // create link
                let link = document.createElement('a');
                link.classList.add('button_link');
                link.innerHTML = 'Load Project From Storage';
                link.title = "Load the project currently in the browser's local storage";
                link.addEventListener('click', function() {
                        this.loadProjectFromStorage();
                }.bind(this));

                // add font awesome icon
                let icon = document.createElement('i');
                icon.classList.add('fa', 'fa-upload');

                link.prepend(icon);
                loadStorage.appendChild(link);

                return loadStorage;
        }

        // create editor HTML element for opening the project settings popup
        createProjectSettingsElement() {
                let openSettings = document.createElement('div');
                openSettings.classList.add('dropdown_content_item', 'project_settings');

                // create button
                let button = document.createElement('div');
                button.classList.add('button_link');
                button.innerHTML = 'Project Settings';
                button.title = 'Edit the project settings'
                button.addEventListener('click', function() {
                        document.body.appendChild(this.createProjectSettingsPopup());
                }.bind(this));

                // add font awesome icon
                let icon = document.createElement('i');
                icon.classList.add('fa', 'fa-sliders');

                button.prepend(icon);
                openSettings.appendChild(button);

                return openSettings;
        }

        // create editor HTML popup window for the project settings
        createProjectSettingsPopup() {
                let popup = document.createElement('div');
                popup.classList.add('popup', 'project_settings');

                // title
                let popupTitle = document.createElement('div');
                popupTitle.classList.add('popup_title');

                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = 'Project Settings';

                let closeButton = document.createElement('i');
                closeButton.classList.add('close', 'fa', 'fa-xmark');
                closeButton.addEventListener('click', function(e) {
                        e.target.closest('.popup').remove();
                });

                popupTitle.appendChild(title);
                popupTitle.appendChild(closeButton);

                // content
                let popupContent = document.createElement('div');
                popupContent.classList.add('popup_content');

                popupContent.appendChild(this.createProjectSettingsForm());

                popup.appendChild(popupTitle);
                popup.appendChild(popupContent);

                return popup;
        }

        // create HTML form with this project's settings
        createProjectSettingsForm() {
                let form = document.createElement('form');
                form.id = 'project-settings-form';

                // create an input field for each setting
                for (let key in this.project.settings) {
                        let formItem = document.createElement('div');
                        formItem.classList.add('form_item');

                        let label = document.createElement('label');
                        label.innerHTML = key;
                        label.setAttribute('for', `item-${key}`);

                        let input = document.createElement('input');
                        input.id = `item-${key}`;
                        input.setAttribute('type', 'text');
                        input.value = this.project.settings[key];

                        formItem.append(label);
                        formItem.append(input);

                        form.appendChild(formItem);
                }

                // add a submit button
                let submitItem = document.createElement('div');
                submitItem.classList.add('form_item');

                let submitButton = document.createElement('input');
                submitButton.setAttribute('type', 'submit');
                submitButton.classList.add('fake_button');
                submitButton.value = 'Save Changes';

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

        // create editor HTML tabbar for different uses e.g. file options, project settings, etc.
        loadEditorTabbar() {
                // file dropdown options
                let fileDropdown = document.createElement('div');
                fileDropdown.classList.add('dropdown', 'navbar_item');

                let fileDropdownButton = document.createElement('div');
                fileDropdownButton.classList.add('dropdown_button');
                fileDropdownButton.innerHTML = 'File';

                fileDropdown.appendChild(fileDropdownButton);
                let fileDropdownContent = document.createElement('div');
                fileDropdownContent.classList.add('dropdown_content');

                // upload file
                fileDropdownContent.appendChild(this.createFileToProjectElement());
                // load project from localStorage
                fileDropdownContent.appendChild(this.createLoadStorageElement());

                // download project file
                fileDropdownContent.appendChild(this.createDownloadProjectElement());
                // save project to localStorage
                fileDropdownContent.appendChild(this.createSaveStorageElement());

                fileDropdown.appendChild(fileDropdownContent);
                document.querySelector(this.settings['tabbarSelector']).appendChild(fileDropdown);

                // project dropdown options
                // file dropdown options
                let projectDropdown = document.createElement('div');
                projectDropdown.classList.add('dropdown', 'navbar_item');

                let projectDropdownButton = document.createElement('div');
                projectDropdownButton.classList.add('dropdown_button');
                projectDropdownButton.innerHTML = 'Project';

                projectDropdown.appendChild(projectDropdownButton);
                let projectDropdownContent = document.createElement('div');
                projectDropdownContent.classList.add('dropdown_content');

                // upload file
                projectDropdownContent.appendChild(this.createProjectSettingsElement());

                projectDropdown.appendChild(projectDropdownContent);
                document.querySelector(this.settings['tabbarSelector']).appendChild(projectDropdown);
        }

        // SCENES
        // create editor HTML element for the scene list
        createScenesListElement() {
                let i = 0;
                let sl = this.project.sceneList.length;
                // loop all scenes in project and add scene card HTML
                while (i < sl) {
                        this.createSceneCardElement(this.project.sceneList[i]);

                        ++i;
                }

                // "add new scene" button
                let button = document.createElement('div');
                button.classList.add('fake_button', 'mt_auto');
                button.title = 'Adds a new scene to the project';
                button.innerHTML = '&#x2b; Add New Scene';
                button.addEventListener('click', function() {
                        this.project.addScene(new Scene());

                        window.dispatchEvent(new Event('scene_list_changed'));
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
                let wrapper = document.createElement('div');
                wrapper.classList.add('scene');

                let name = scene.name.createWidget();

                wrapper.appendChild(name);

                if (scene !== this.currentScene) {
                        let button = document.createElement('div');
                        button.classList.add('fake_button');
                        button.innerHTML = 'Select';
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
                // loop all game objects in the current scene
                while (i < l) {
                        this.createGameObjectCardElement(this.currentScene.gameObjects[i]);

                        ++i;
                }

                // "add new gameObject" form
                let select = document.createElement('select');
                select.title = "Adds a new GameObject to the selected scene";
                select.classList.add('add_gameObject');

                let defaultOption = document.createElement('option');
                defaultOption.innerHTML = "&#x2b; Add New GameObject";
                defaultOption.value = 0;

                select.appendChild(defaultOption);

                i = 0;
                l = this.project.availableGameObjects.length;
                // loop all available game objects for the dropdown
                while (i < l) {
                        let option = document.createElement('option');
                        option.innerHTML = this.project.availableGameObjects[i];
                        option.value = this.project.availableGameObjects[i];

                        select.appendChild(option);

                        ++i;
                }

                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
                        if (selectedOption !== 0) {
                                let newObject = eval(`new ${selectedOption}()`);

                                this.currentScene.addGameObject(newObject);
                        }

                        this.reloadEditorElements();
                }.bind(this));

                document.querySelector(this.project.settings.gameObjectListWrapper).appendChild(select);
        }

        // create editor HTML element for the gameObject title
        createGameObjectTitleElement(gameObject) {
                let content = document.createElement('div');
                content.classList.add('content');

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
                let wrapper = document.createElement('div');
                wrapper.classList.add('game_object');
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

                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = gameObject.attributes['name'].value;

                wrapper.appendChild(title);

                let listNode = document.querySelector(this.project.settings.gameObjectListWrapper);
                listNode.appendChild(wrapper);
        }

        // COMPONENTS
        // create editor HTML element containing all components
        createComponentsListElement(gameObject) {
                let i = 0;
                let l = gameObject.components.length;

                // create info card
                let card = document.createElement('div');
                card.classList.add('card', 'components_list');

                let title = document.createElement('div');
                title.classList.add('card_title');

                title.appendChild(this.createGameObjectTitleElement(gameObject));

                let content = document.createElement('div');
                content.classList.add('card_content');

                // add component cards to card content
                while (i < l) {
                        content.appendChild(this.createComponentCardElement(gameObject.components[i]));

                        ++i;
                }

                // add new component select to card content
                let select = document.createElement('select');
                select.title = "Adds a new component to the selected GameObject";
                select.classList.add('add_component');

                let defaultOption = document.createElement('option');
                defaultOption.innerHTML = "&#x2b; Add New Component";
                defaultOption.value = 0;

                select.appendChild(defaultOption);

                let j = 0;
                let ac = this.project.availableComponents.length;

                while (j < ac) {
                        let option = document.createElement('option');
                        option.innerHTML = this.project.availableComponents[j];
                        option.value = this.project.availableComponents[j];

                        select.appendChild(option);

                        ++j;
                }
                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
                        if (selectedOption !== 0) {
                                let newComponent = eval(`new ${selectedOption}()`);

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
                let wrapper = document.createElement('div');
                wrapper.classList.add('component');
                // transform components are open by default
                if (component instanceof Transform) {
                        wrapper.classList.add('open');
                }

                let title = document.createElement('div');
                title.classList.add('title');

                let titleContent = document.createElement('div');
                titleContent.classList.add('component_name');
                titleContent.innerHTML = component.type;

                let collapse = document.createElement('div');
                collapse.title = 'Collapse/Expand this component';
                collapse.classList.add('collapse');
                collapse.innerHTML = "&#10095;";

                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                title.appendChild(titleContent);
                // can't disable transform components!
                if (!(component instanceof Transform)) {
                        title.appendChild(component.attributes['enabled'].createWidget());
                }

                title.appendChild(collapse);

                let content = document.createElement('div');
                content.classList.add('content');

                for (let key in component.attributes) {
                        // skip "enabled" attribute because we already added it in the title
                        if (key === 'enabled') {
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


        // EVERYTHING COMBINED
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
        closeAllDropdowns() {
                let dropdowns = document.querySelectorAll('.dropdown');

                for (let i = 0; i < dropdowns.length; i++) {
                        dropdowns[i].classList.remove('open');
                }
        }

        /* EVENT CALLS */
        // event callback function
        handleEvent(e) {
                switch (e.type) {
                        case 'project_settings_changed':
                                this.onProjectsettingschanged(e);
                                break;

                        case 'scene_list_changed':
                                this.onScenelistchanged(e);
                                break;

                        case 'mousedown':
                                this.onMousedown(e);
                                break;

                        case 'mouseup':
                                this.onMouseup(e);
                                break;

                        case 'mousemove':
                                this.onMousemove(e);
                                break;

                        case 'click':
                                this.onClick(e);
                                break;

                        default:
                                console.log(`Unexpected event: ${e.type}`);
                }
        }

        // event function that is called on 'mousedown' event on canvas
        onMousedown(e) {
                if (e.which == 1) {
                        this.cursor.leftClick = true;
                        this.cursor.leftClickDownPos = new Vector2(e.clientX, e.clientY);
                } else if (e.which == 3) {
                        this.cursor.rightClick = true;
                        this.cursor.rightClickDownPos = new Vector2(e.clientX, e.clientY);
                }
        }

        // event function that is called on 'mouseup' event on canvas
        onMouseup(e) {
                if (e.which == 1) {
                        this.cursor.leftClick = false;
                        this.cursor.leftClickUpPos = new Vector2(e.clientX, e.clientY);
                } else if (e.which == 3) {
                        this.cursor.rightClick = false;
                        this.cursor.rightClickUpPos = new Vector2(e.clientX, e.clientY);
                }
        }

        // event function that is called on 'mousemove' event on canvas
        onMousemove(e) {
                // check if the cursor is hovering a gizmo
                // @todo: add functionality

                this.hovering = this.canvas;

                // if no gizmo is being hovered and the left button is being held down, move the camera
                if ((this.cursor.leftClick === true) &&
                (this.hovering === this.canvas))
                {
                        let mouseMovement = new Vector2(e.movementX, e.movementY);
                        this.camera.worldPos.subtract(mouseMovement);
                }
        }

        // event function that is called on 'click' event on the document
        onClick(e) {
                if (e.target.classList.contains('dropdown_button')) {
                        this.closeAllDropdowns();

                        e.target.parentElement.classList.add('open');
                } else {
                        if (!e.target.closest('.dropdown')) {
                                this.closeAllDropdowns();
                        }
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