
class Scene {
        project = null;
        mainCamera = new MainCamera();
        gameObjects = [];
        settings = {
                sortingLayers: [],

        };

        processFrame() {
                // clear canvas
                this.project.canvasContext.clearRect(0, 0, this.project.canvas.width, this.project.canvas.height);

                // process all gameObjects
                let i = 0;
                let l = this.gameObjects.length;

                while (i < l) {
                        this.gameObjects[i].update();
                        this.gameObjects[i].lateUpdate();

                        ++i;
                }

                // taken from main.js Game class
                
                /*
                // process all ground objects
                let i = 0;
                let l = this.groundObjects.length;
                
                while (i < l) {
                        let groundObject = this.groundObjects[i];
                        groundObject.game = this;

                        if (groundObject.renderer != null) {
                                groundObject.renderer.render(canvasContext, this.activeCamera);
                        }

                        // debug - show bounds of components
                        if (this.debugging == true) {
                                groundObject.showBounds(canvasContext, this.activeCamera);
                        }

                        ++i;
                }

                // process all game objects
                i = 0;
                l = this.gameObjects.length;

                while (i < l) {
                        let gameObject = this.gameObjects[i];
                        gameObject.game = this;

                        // first process movement of all gameobjects
                        gameObject.update();
                        gameObject.lateUpdate();

                        this.gameObjects.sort(sortByYPos);

                        // position active camera after all gameobjects have been processed
                        if ( (gameObject.camera != null) && (this.activeCamera != gameObject.camera) ) {
                                // only one gameobject at a time is allowed to have a camera
                                this.activeCamera = gameObject.camera;
                        } else {
                                this.activeCamera.lateUpdate();
                        }

                        // render all gameobjects after all postioning is done
                        if (gameObject.renderer != null) {
                                gameObject.renderer.render(canvasContext, this.activeCamera);
                        }

                        // debug - show bounds of components
                        if (this.debugging == true) {
                                gameObject.showBounds(canvasContext, this.activeCamera);
                                
                                if (gameObject.collider.length > 0) {
                                        let j = 0;
                                        let c = gameObject.collider.length;

                                        while (j < c) {
                                                gameObject.collider[j].showBounds(canvasContext);
                                                
                                                ++j;
                                        }
                                }

                                if (gameObject.renderer != null) {
                                        gameObject.renderer.showBounds(canvasContext, this.activeCamera);
                                }
                        }

                        ++i;
                }
                
                // debug - show default area of the canvas (without camera translation)
                if (this.debugging == true) {
                        canvasContext.save();

                        canvasContext.translate(0 - this.activeCamera.pos.x, 0 - this.activeCamera.pos.y);
                        canvasContext.lineWidth = 2;
                        canvasContext.strokeStyle = "#aaff00";
                        canvasContext.strokeRect(0, 0, this.canvas.width, this.canvas.height);
                        
                        canvasContext.restore();
                }
                */
        }

        processFixedUpdateFrame() {
                // DON'T USE THIS TO RENDER OBJECTS - RENDERING SHOULD STAY IN THE PROCESSFRAME FUNCTION
        }

        addGameObject(object) {
                if ((typeof object == "object") && (object instanceof GameObject)) {
                        object.scene = this;
                        object.start();
                        this.gameObjects.push(object);

                        return true;
                }

                return false;
        }

        // mouse down event
        onMouseDown(mouseDown) {

        }
        
        // mouse up event
        onMouseUp() {
                
        }
}