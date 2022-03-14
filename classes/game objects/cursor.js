
class Cursor extends GameObject {
        type = "Game Object/Cursor";
        name ="Cursor";
        moveDelta = new Vector2();

        addEventListeners() {
                this.scene.project.canvas.addEventListener("mousemove", this);
                this.scene.project.canvas.addEventListener("mousedown", this);
                this.scene.project.canvas.addEventListener("mouseup", this);
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
                }
        }
        
        onMouseMove(e) {
                let rect = this.canvas.getBoundingClientRect();

                this.pos = new Vector2(
                        e.clientX - rect.left,
                        e.clientY - rect.top
                );

                this.moveDelta = new Vector2(
                        e.movementX,
                        e.movementY
                );

                /*
                @todo: FIX THIS TO WORK AS A GAMEOBJECT

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
                */
                
                // reset cursor moveDelta movement
                clearTimeout(mouseMoveTimeout);
                mouseMoveTimeout = setTimeout(function() {
                        this.moveDelta = new Vector2();
                }.bind(this), 1);
        }

        onMouseDown(e) {
                let rect = this.canvas.getBoundingClientRect();
                let mouseDown = new Vector2(
                        e.clientX - rect.left,
                        e.clientY - rect.top
                );

                /* 
                @todo: FIX THIS TO WORK AS A GAMEOBJECT

                for (let gameObject of this.gameObjects) {
                        if ( (gameObject.type == "Draggable Object") && (gameObject.collider.length > 0) ) {
                                let j = 0;
                                let c = gameObject.collider.length;
                
                                while (j < c) {
                                        if (gameObject.collider[j].checkPointInside(mouseDown.x, mouseDown.y, this.activeCamera)) {
                                                gameObject.onMouseDown(this.cursor);
                                        }

                                        ++j;
                                }
                        }
                }
                */
        }

        onMouseUp() {
                /*
                @todo: FIX THIS TO WORK AS A GAMEOBJECT
                
                for (let gameObject of this.gameObjects) {
                        if ( (gameObject.type == "Draggable Object") && (gameObject.collider.length > 0) ) {
                                gameObject.onMouseUp();
                        }
                }
                */
        }
}