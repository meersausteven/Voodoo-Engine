
class Editor {
        project;
        availableGameObjects = [];
        availableComponents = [];
        settings = {
                tabbarSelector: '#editor-tabbar'
        };
        
        constructor() {
                this.project = new Project(true);
        }

        start() {
                this.project.start();
                this.loadEditorTabbar();
                this.createEditorElements();

                window.addEventListener('scene_list_changed', this);
        }

        // save current project to localStorage
        saveProjectToStorage() {
                localStorage.setItem('project', this.#projectToJson());
        }

        // load a project from the localStorage
        loadProjectFromStorage() {
                let json = localStorage.getItem('project');
                
                if ((json !== null) && (typeof json !== 'undefined')) {
                        this.#jsonToProject(json);
                } else {
                        console.log('No Project in storage. Try saving one first.');
                }
        }

        // turn a passed json object into a project object
        #jsonToProject(json) {
                // @todo: add functionality
                let dummy = JSON.parse(json);
                
                let project = new Project(true);
                project.settings = dummy.settings;

                let i = 0;
                let sl = dummy.sceneList.length;
                while (i < sl) {
                        let scene = new Scene();
                        scene.settings = dummy.sceneList[i].settings;
                        
                        let j = 0;
                        let go = dummy.sceneList[i].gameObjects.length;
                        while (j < go) {
                                let gameObject = new GameObject();

                                for (let key in dummy.sceneList[i].gameObjects[j].attributes) {
                                        let dummyAttribute = dummy.sceneList[i].gameObjects[j].attributes[key];

                                        if (!(dummyAttribute instanceof Object) ||
                                             dummyAttribute instanceof Array)
                                        {
                                                gameObject.attributes[key] = dummyAttribute;

                                                continue;
                                        }

                                        gameObject.attributes[key].name = dummyAttribute.name;

                                        if (dummyAttribute.value instanceof Object) {
                                                gameObject.attributes[key].value = new Vector2(dummyAttribute.value.x, dummyAttribute.value.y);
                                        } else {
                                                gameObject.attributes[key].value = dummyAttribute.value;
                                        }
                                }

                                let k = 0;
                                let c = dummy.sceneList[i].gameObjects[j].components.length;
                                while (k < c) {
                                        let type = dummy.sceneList[i].gameObjects[j].components[k].type;
                                        type = type.replace(/\s+/g, '');
                                        let component = eval(`new ${type}()`);
                                        
                                        for (let key in dummy.sceneList[i].gameObjects[j].components[k].attributes) {
                                                let dummyAttribute = dummy.sceneList[i].gameObjects[j].components[k].attributes[key];

                                                if (!(dummyAttribute instanceof Object) ||
                                                     dummyAttribute instanceof Array)
                                                {
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
                                        gameObject.components[k] = component;

                                        ++k;
                                }

                                scene.addGameObject(gameObject);

                                ++j;
                        }

                        project.addScene(scene);

                        ++i;
                }

                this.project = project;
                this.project.start();
                this.removeEditorElements();
                this.createEditorElements();
        }

        // turn current project object into a json object
        #projectToJson() {
                let json;

                json = this.project.prepareForJsonExport();

                return json;
        }

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
                                this.#jsonToProject(reader.result);
                        }.bind(this));

                        if (file) {
                                reader.readAsText(file);
                        }
                }.bind(this));

                // create label for input element
                let label = document.createElement('label');
                label.classList.add('button_link');
                label.innerHTML = 'Load Project From File';
                label.setAttribute('for', input.id);

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
                label.addEventListener('click', function() {
                        // create invisible link element when clicked
                        let link = document.createElement('a');
                        link.classList.add('button_link');
                        // create json file from current project
                        link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.#projectToJson()));
                        link.setAttribute('download', 'project-' + Date.now() + '.json');
                        // click link automatically
                        link.click();

                        link.remove();
                }.bind(this));

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
                link.addEventListener('click', function() {
                        this.saveProjectToStorage();
                }.bind(this));

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
                link.addEventListener('click', function() {
                        this.loadProjectFromStorage();
                }.bind(this));

                loadStorage.appendChild(link);

                return loadStorage;
        }

        // create editor HTML tabbar for different uses e.g. file options, project settings, etc.
        loadEditorTabbar() {
                // file options
                let item = document.createElement('div');
                item.classList.add('dropdown', 'navbar_item');

                let button = document.createElement('div');
                button.classList.add('dropdown_button');
                button.innerHTML = 'File';

                item.appendChild(button);
                let content = document.createElement('div');
                content.classList.add('dropdown_content');

                // upload file
                content.appendChild(this.createFileToProjectElement());
                // load project from localStorage
                content.appendChild(this.createLoadStorageElement());

                // download project file
                content.appendChild(this.createDownloadProjectElement());
                // save project to localStorage
                content.appendChild(this.createSaveStorageElement());

                item.appendChild(content);
                document.querySelector(this.settings['tabbarSelector']).appendChild(item);
        }

        // @todo: ADD FUNCTIONS FOR THE DIFFERENT HTML CARDS
        //        GAMEOBJECTS, COMPONENTS, ETC.
        //        ALL FUNCTIONS THAT ONLY AFFECT THE EDITOR NEED TO BE PART OF THE EDITOR CLASS
        //        CLEAN THE OTHER CLASSES UP FOR IN-GAME USE ONLY - NO EDITOR STUFF

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
                button.innerHTML = 'Add New Scene';
                button.addEventListener('click', function() {
                        this.project.addScene(new Scene());
                        
                        window.dispatchEvent(new Event('scene_list_changed'));
                }.bind(this));

                document.querySelector(this.project.settings.sceneListWrapper).appendChild(button);
        }

        // remove all editor HTML elemnts for the scenes list
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

                let label = document.createElement('div');
                label.classList.add('name');
                label.innerHTML = scene.name;

                wrapper.appendChild(label);

                if (scene.isCurrentScene !== true) {
                        let button = document.createElement('div');
                        button.classList.add('fake_button');
                        button.innerHTML = 'Load Scene';
                        button.addEventListener('click', function() {
                                this.project.loadScene(this.project.getSceneIndex(scene));

                                window.dispatchEvent(new Event('scene_list_changed'));
                        }.bind(this));

                        wrapper.appendChild(button);
                }

                let listNode = document.querySelector(this.project.settings.sceneListWrapper);
                listNode.appendChild(wrapper);
        }

        // create editor HTML for all gameObjects
        createGameObjectsListElement() {
                let i = 0;
                let l = this.project.activeScene.gameObjects.length;
                // loop all game objects in the current scene
                while (i < l) {
                        this.createGameObjectCardElement(this.project.activeScene.gameObjects[i]);

                        ++i;
                }

                // "add new gameObject" form
                let select = document.createElement('select');
                select.classList.add('add_gameObject');

                let defaultOption = document.createElement('option');
                defaultOption.innerHTML = "Add New GameObject";
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

                                this.project.activeScene.addGameObject(newObject);
                        }
                        
                        this.removeEditorElements();
                        this.createEditorElements();
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
                        } else {
                                thisElement.classList.remove('selected');
                                this.removeComponentsListElement();
                        }
                }.bind(this));

                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = gameObject.attributes['name'].value;

                wrapper.appendChild(title);

                let listNode = document.querySelector(this.project.settings.gameObjectListWrapper);
                listNode.appendChild(wrapper);
        }

        // create editor HTML element containing all components
        createComponentsListElement(gameObject) {
                let i = 0;
                let l = gameObject.components.length;

                // create info card
                let card = document.createElement('div');
                card.classList.add('card');

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
                select.classList.add('add_component');

                let defaultOption = document.createElement('option');
                defaultOption.innerHTML = "Add new Component";
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
                title.innerHTML = component.type;
                
                let collapse = document.createElement('div');
                collapse.classList.add('collapse');
                collapse.innerHTML = "&#10095;";

                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                title.appendChild(collapse);
                
                let content = document.createElement('div');
                content.classList.add('content');

                for (let key in component.attributes) {
                        if (component.attributes[key] instanceof AttributeText) {
                                content.appendChild(component.attributes[key].createWidget());
                        }
                }

                wrapper.appendChild(title);
                wrapper.appendChild(content);

                return wrapper;
        }

        // create editor HTML for the current project
        createEditorElements() {
                // load sceneList
                this.createScenesListElement();

                // load gameObjects
                this.createGameObjectsListElement();
        }

        // remove all current editor HTML elements
        removeEditorElements() {
                // scenes
                this.removeScenesListElement();

                // game Objects
                this.removeGameObjectsListElement();

                // components
                this.removeComponentsListElement();
        }

        // event callback function
        handleEvent(e) {
                switch (e.type) {
                        case 'scene_list_changed':
                                console.log('Event `scene_list_changed` occoured!');

                                this.removeEditorElements();
                                this.createEditorElements();

                                break;
                        default:
                                console.log(`encountered unaccounted event: ${e.type}`);
                                break;
                }
        }
}