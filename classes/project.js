
class Project {
        // canvas
        canvas = document.getElementById("gameArea");
        canvasContext = null;
        
        // scenes
        sceneList = [];
        activeScene = null;
        
        // settings
        settings = {
                // canvas size
                canvasHeight: 720,
                canvasWidth: 1280,
                // hide mouse cursor
                hideCursorOnCanvas: false,
                // show gizmos for gameobjects (arrows and rotation)
                showObjectGizmos: false,
                // show bounds of colliders
                showColliderBounds: false,
                // interval (in ms) for the fixed update call
                fixedUpdateSpeed: 10,
                // renders all objects according to their y position whereas it draws objects with a lower y position first
                sortByYPosition: false,
                // file paths
                spriteFilesPath: window.location.href + "/../assets/sprites/",
                audioFilesPath: window.location.href + "/../assets/audio/"
        };

        // global stuff
        fixedUpdate;
        
        start() {
                // set canvas
                this.canvas.width = this.settings.canvasWidth;
                this.canvas.height = this.settings.canvasHeight;
                this.canvasContext = this.canvas.getContext("2d");
                this.canvasContext.imageSmoothingEnabled = false;

                // add event listeners for keyboard input
                this.addEventListeners();

                // start fixedUpdate interval
                this.fixedUpdate = setInterval(this.processFixedUpdateFrame.bind(this), this.settings.fixedUpdateSpeed);
                window.requestAnimationFrame(this.processFrame.bind(this));
        }
        
        stop() {
                clearInterval(this.fixedUpdate);
                window.cancelAnimationFrame();
        }

        processFrame(currentTime) {
                // track time
                if ( !time.startTime ) {
                        time.startTime = currentTime / 1000;
                }
                
                if ( !time.lastFrame ) {
                        time.lastFrame = currentTime / 1000;
                }
                
                time.totalTime = (currentTime / 1000) - time.startTime;
                time.deltaTime = (currentTime / 1000) - time.lastFrame;
                time.lastFrame = currentTime / 1000;

                // process update frame in scene
                if (this.activeScene != null) {
                        this.activeScene.processFrame();
                }

                // update settings
                if (this.settings.hideCursorOnCanvas && !this.canvas.classList.contains('no-cursor')) {
                        this.canvas.classList.add('no-cursor');
                } else if (!this.settings.hideCursorOnCanvas && this.canvas.classList.contains('no-cursor')) {
                        this.canvas.classList.remove('no-cursor')
                }
                
                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        processFixedUpdateFrame() {
                // process fixed update frame in scene
                if (this.activeScene != null) {
                        this.activeScene.processFixedUpdateFrame();
                }
        }

        addScene(scene) {
                if ((typeof scene == "object") && (scene instanceof Scene)) {
                        scene.project = this;
                        this.sceneList.push(scene);

                        return true;
                }

                return false;
        }

        loadScene(index) {
                this.activeScene = this.sceneList[index];
        }

        addEventListeners() {
                document.addEventListener("keydown", this);
                document.addEventListener("keyup", this);
        }

        handleEvent(e) {
                switch (e.type) {
                        case "keydown":
                                this.onKeyDown(e);
                                break;

                        case "keyup":
                                this.onKeyUp(e);
                                break;

                        default:
                                break;
                }
        }

        onKeyDown(e) {
                if (e.repeat) {
                        return;
                }

                currentKeyInput.push(e.code);
                currentKeyInput.clear();
        }

        onKeyUp(e) {
                currentKeyInput.remove(e.code);
        }
}
