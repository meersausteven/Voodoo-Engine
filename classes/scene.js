
class Scene {
        name = 'New Scene';
        project;
        isCurrentScene;
        activeCamera;
        gameObjects = [];
        settings = {
                sortingLayers: [],

        };

        constructor() {
                // add default camera object
                this.addGameObject(new CameraObject());
                this.isCurrentScene = false;
        }

        start() {
                //start all game objects
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        if (this.gameObjects[i].attributes['enabled'].value === true) {
                                this.gameObjects[i].start();
                                console.log("started " + this.gameObjects[i].attributes['name'].value);
                        }

                        ++i;
                }

                // get default camera component
                this.activeCamera = this.#getCamera();
        }

        processUpdateFrame() {
                if ((this.project !== null) &&
                    (typeof this.project !== 'undefined'))
                {
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
                }
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

                        window.dispatchEvent(new Event('game_object_list_changed'));

                        return true;
                }
        }

        removeGameobject(index) {
                if ((typeof index == "number") &&
                    ((this.gameObjects[index] !== null) &&
                    (typeof this.gameObjects[index] !== "undefined")))
                {
                        this.gameObjects[index] = null;

                        window.dispatchEvent(new Event('game_object_list_changed'));
                }
        }

        #getCamera() {
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        let j = 0;
                        let c = this.gameObjects[i].components.length;

                        while (j < c) {
                                if (this.gameObjects[i].components[j] instanceof Camera) {
                                        return this.gameObjects[i].components[j];
                                }

                                j++;
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
                        if ((key !== 'remove') &&
                            (key !== 'clear'))
                        {
                                dummy.settings[key] = this.settings[key];
                        }
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