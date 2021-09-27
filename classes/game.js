
class Game {
        constructor() {
                // canvas stuff
                this.width = 1280;
                this.height = 720;
                this.canvas = document.getElementById("gameArea");
                
                // objects
                this.gameObjects = [];
                this.groundObjects = [];
                
                // camera
                this.activeCamera = new Camera(this.canvas, 0, 0);
                
                // cursor 
                this.cursor = {
                        pos: {
                                x: null,
                                y: null
                        },
                        delta: {
                                x: null,
                                y: null
                        }
                };
                this.cursorImage = new Image(14, 20);
                this.cursorImage.src = window.location.href + "/../images/cursor.png";

                // debug mode
                this.debugging = false;
        }
        
        start() {
                this.canvas.width = this.width;
                this.canvas.height = this.height;

                this.canvas.addEventListener("mousemove", this);
                this.canvas.addEventListener("mousedown", this);
                this.canvas.addEventListener("mouseup", this);
                document.addEventListener("keydown", this);
                document.addEventListener("keyup", this);

                window.requestAnimationFrame(this.processFrame.bind(this));
        }
        
        stop() {
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

                // draw gameobjects with renderer
                let canvasContext = this.canvas.getContext("2d");
                    canvasContext.imageSmoothingEnabled = false;
                    canvasContext.clearRect(0, 0, this.width, this.height);

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

                // draw cursor
                canvasContext.save();

                canvasContext.translate(this.cursor.pos.x, this.cursor.pos.y);
                canvasContext.drawImage(this.cursorImage, 0, 0);
                
                canvasContext.restore();
                
                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        addGameObject(gameObject) {
                this.gameObjects.push(gameObject);
                
                this.gameObjects.sort(sortByYPos);
        }

        addGroundObject(groundObject) {
                this.groundObjects.push(groundObject);
        }

        loadScene(sceneList, name) {
                this.gameObjects = sceneList[name].gameObjects;
                this.groundObjects = sceneList[name].groundObjects;
        }

        handleEvent(e) {
                switch (e.type) {
                        case "mousemove":
                                this.onMouseMove(e);
                                break;
                        
                        case "mousedown":
                                this.onMouseDown(e);
                                break;
                                        
                        case "mouseup":
                                this.onMouseUp(e);
                                break;

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

        onMouseMove(e) {
                let rect = this.canvas.getBoundingClientRect();

                this.cursor.pos.x = e.clientX - rect.left;
                this.cursor.pos.y = e.clientY - rect.top;

                this.cursor.delta.x = e.movementX;
                this.cursor.delta.y = e.movementY;

                for (let gameObject of this.gameObjects) {
                        if ( (gameObject.type == "Draggable Object") && (gameObject.collider.length > 0) ) {
                                let j = 0;
                                let c = gameObject.collider.length;
                
                                while ((j < c) && (gameObject.hovering == false)) {
                                        if (gameObject.collider[j].checkPointInside(this.cursor.pos.x, this.cursor.pos.y, this.activeCamera)) {
                                                if (gameObject.hovering == false) {
                                                        gameObject.onMouseEnter(this.cursor);
                                                }
                                        } else {
                                                if (gameObject.hovering == true) {
                                                        gameObject.onMouseLeave();
                                                }
                                        }

                                        ++j;
                                }
                        }
                }
                
                clearTimeout(mouseMoveTimeout);
                mouseMoveTimeout = setTimeout(function() {
                        // reset cursor delta movement
                        this.cursor.delta.x = 0;
                        this.cursor.delta.y = 0;
                }.bind(this), 1);
        }

        onMouseDown(e) {
                let rect = this.canvas.getBoundingClientRect();
                let mouseDownX = e.clientX - rect.left;
                let mouseDownY = e.clientY - rect.top;

                for (let gameObject of this.gameObjects) {
                        if ( (gameObject.type == "Draggable Object") && (gameObject.collider.length > 0) ) {
                                let j = 0;
                                let c = gameObject.collider.length;
                
                                while (j < c) {
                                        if (gameObject.collider[j].checkPointInside(mouseDownX, mouseDownY, this.activeCamera)) {
                                                gameObject.onMouseDown(this.cursor);
                                        }

                                        ++j;
                                }
                        }
                }
        }

        onMouseUp() {
                for (let gameObject of this.gameObjects) {
                        if ( (gameObject.type == "Draggable Object") && (gameObject.collider.length > 0) ) {
                                gameObject.onMouseUp();
                        }
                }
        }

        onKeyDown(e) {
                if (e.repeat) {
                        return;
                }

                currentKeyInput.push(e.code);
                currentKeyInput.clear();

                updateKeyboard(e.code);
        }

        onKeyUp(e) {
                currentKeyInput.remove(e.code);

                updateKeyboard(e.code);
        }
}
