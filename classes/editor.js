
class Editor {
        project;
        availableGameObjects = [];
        availableComponents = [];
        
        constructor() {
                this.project = new Project(true);
        }

        start() {
                this.project.start();
        }

        loadProjectFromStorage() {
                let json = localStorage.getItem('project');
                
                this.#jsonToProject(json);
        }

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
                this.clearEditorElements();
                this.loadEditorElements();
        }

        saveProjectToStorage() {
                localStorage.setItem('project', this.#projectToJson());
        }

        #projectToJson() {
                let json;

                json = this.project.prepareForJsonExport();

                return json;
        }

        downloadProjectFile() {
                let download = document.createElement('a');
                download.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.#projectToJson()));
                download.setAttribute('download', 'project-' + Date.now() + '.json');

                download.style.display = 'none';
                document.body.appendChild(download);

                download.click();

                document.body.removeChild(download);
        }

        loadProjectFromFile() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('upload_wrapper');

                let text = document.createElement('div');
                text.classList.add('upload_text');

                let fileUpload = document.createElement('input');
                fileUpload.setAttribute('type', 'file');
                fileUpload.setAttribute('accept', 'application/json');
                fileUpload.classList.add('upload_field');
                fileUpload.addEventListener('change', function(e) {
                        let file = e.target.files[0];

                        if (file.type !== 'application/json') {
                                console.log("only .json files are accepted!");
                                return false;
                        }

                        let reader = new FileReader();
                        
                        reader.addEventListener('load', function() {
                               this.#jsonToProject(reader.result);

                               wrapper.remove();
                        }.bind(this));

                        if (file) {
                                reader.readAsText(file);
                        }
                }.bind(this));
                
                wrapper.appendChild(fileUpload);
                wrapper.appendChild(text);

                document.body.appendChild(wrapper);
        }

        loadEditorElements() {
                // load gameObjects
                let i = 0;
                let l = this.project.activeScene.gameObjects.length;

                while (i < l) {
                        this.project.activeScene.gameObjects[i].createCard();

                        ++i;
                }

                // add gameObject form
                let select = document.createElement('select');
                select.classList.add('add_gameObject');

                let defaultOption = document.createElement('option');
                defaultOption.innerHTML = "Add New GameObject";
                defaultOption.value = 0;

                select.appendChild(defaultOption);

                let j = 0;
                let ago = this.project.availableGameObjects.length;

                while (j < ago) {
                        let option = document.createElement('option');
                        option.innerHTML = this.project.availableGameObjects[j];
                        option.value = this.project.availableGameObjects[j];

                        select.appendChild(option);
                        
                        ++j;
                }
                
                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
                        if (selectedOption !== 0) {
                                let newObject = eval(`new ${selectedOption}()`);

                                this.project.activeScene.addGameObject(newObject);
                        }
                        
                        this.clearEditorElements();
                        this.loadEditorElements();
                }.bind(this));

                document.querySelector(this.project.settings.gameObjectListWrapper).appendChild(select);
        }

        clearEditorElements() {
                // game Objects
                let gameObjectsNode = document.querySelector(this.project.settings.gameObjectListWrapper);
                let i = 0;
                let l = gameObjectsNode.children.length;

                while (i < l) {
                        gameObjectsNode.lastElementChild.remove();
                        
                        ++i;
                }

                // game Objects
                let componentsListNode = document.querySelector(this.project.settings.componentListWrapper);
                i = 0;
                l = componentsListNode.children.length;

                while (i < l) {
                        componentsListNode.lastElementChild.remove();
                        
                        ++i;
                }
        }
}