
class Scene {
        project;
        activeCamera;
        gameObjects = [];
        settings = {
                sortingLayers: [],

        };

        constructor() {
                this.addGameObject(new CameraObject());
                this.activeCamera = this.#getCamera();
        }

        start() {
                //start all game objects
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].start();
                        }

                        ++i;
                }
        }

        processUpdateFrame() {
                if ((this.project === null) ||
                    (typeof this.project == 'undefined'))
                {
                        return false;
                }

                // process all gameObjects
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].update();
                                this.gameObjects[i].lateUpdate();
                        }

                        ++i;
                }

                // get active camera view
                this.project.canvasContext.clearRect(0, 0, this.project.canvas.width, this.project.canvas.height);

                this.project.canvasContext.drawImage(this.activeCamera.canvas, 0, 0);

                return true;
        }

        processFixedUpdateFrame() {
                // process all gameObjects
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].fixedUpdate();
                        }

                        ++i;
                }
        }

        addGameObject(object) {
                if (object instanceof GameObject) {
                        object.scene = this;
                        this.gameObjects.push(object);

                        dispatchEvent(new Event('game_object_list_changed'));

                        return true;
                }

                return false;
        }

        removeGameobject(index) {
                if ((typeof index == "number") &&
                    ((this.gameObjects[index] !== null) &&
                    (typeof this.gameObject[index] != "undefined")) ) {
                        this.gameObject[index] = null;

                        dispatchEvent(new Event('game_object_list_changed'));

                        return true;
                }

                return false;
        }

        #getCamera() {
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i] instanceof CameraObject) {
                                let j = 0;
                                let c = this.gameObjects[i].components.length;

                                while (j < c) {
                                        if (this.gameObjects[i].components[j] instanceof Camera) {
                                                return this.gameObjects[i].components[j];
                                        }

                                        j++;
                                }
                        }

                        ++i;
                }

                return null;
        }

        prepareForJsonExport() {
                let dummy = {};

                // scene settings
                dummy.settings = {};
                for (let key in this.settings) {
                        if ((key === 'remove') ||
                            (key === 'clear'))
                        {
                                continue;
                        }

                        dummy.settings[key] = this.settings[key];
                }

                // scene active camera
                dummy.activeCamera = [];
                dummy.activeCamera[0] = {};
                dummy.activeCamera[0].name 

                // scene game objects
                dummy.gameObjects = [];

                let i = 0;
                let l = this.gameObjects.length;
                while (i < l) {
                        dummy.gameObjects[i] = this.gameObjects[i].prepareForJsonExport();

                        ++i;
                }
                
                return dummy;
        }
}