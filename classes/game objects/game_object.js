
class GameObject {
        type = "Game Object";
        name = "New GameObject";
        pos = new Vector2();
        rotationAngle = 0;
        components = [];

        constructor(x = 0, y = 0, rotationAngle = 0) {
                this.pos = new Vector2(x, y);
                this.rotationAngle = rotationAngle;

                this.components = [];
        }

        start() {
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].start();
                        
                        ++i;
                }
        }

        update() {
                // update all components of this gameObject
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].update();
                        
                        ++i;
                }

                if (this.scene.project.settings.showObjectGizmos) {
                        this.showGizmo();
                }
                /*
                // @todo: mvoe this stuff to its component
                if (this.collider.length > 0) {
                        let j = 0;
                        let c = this.collider.length;

                        while (j < c) {
                                this.collider[j].parent = this;
                                this.collider[j].camera = this.game.activeCamera;
                                this.collider[j].update();
                                
                                ++j;
                        }

                        if (this.rigidbody != null) {
                                this.rigidbody.update();

                                let i = 0;                             // looping through all gameobjects in the current game
                                let l = this.game.gameObjects.length;  // game.gameobjects length
                                
                                while (i < l) {
                                        let gameObject = this.game.gameObjects[i];
                                        
                                        if ((gameObject != this) && (gameObject.collider.length > 0)) {
                                                // loop through all colliders of all other game objects
        
                                                let t = 0;                      // looping through this.collider
                                                let tc = this.collider.length;  // this.collider length
        
                                                while (t < tc) {
                                                        if (this.collider[t].isTrigger != true) {
                                                                ++t;
                                                                continue;
                                                        }

                                                        if (this.collider[t].checkTriggerZone(gameObject.collider)) {
                                                                gameObject.collider.onAction(this.parent, "trigger");
                                                        }
        
                                                        ++t;
                                                }
                                        }
        
                                        ++i;
                                }
                        }
                }

                if (this.animation != null) {
                        this.animation.update();
                }
                */
        }

        fixedUpdate() {
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].fixedUpdate();
                        
                        ++i;
                }
        }

        lateUpdate() {
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].lateUpdate();
                        
                        ++i;
                }
        }

        onAction(actor, actionType) {
                return;
        }
        
        addComponent(component) {
                if ((typeof component == "object") && (component instanceof Component)) {
                        component.gameObject = this;
                        this.components.push(component);

                        return true;
                }

                return false;
        }

        showGizmo() {
                let context = this.scene.project.canvasContext;

                context.save();
                // position
                context.translate(this.pos.x - this.scene.mainCamera.pos.x, this.pos.y - this.scene.mainCamera.pos.y);
                context.rotate(this.rotationAngle);
                // @todo: add gizmo for positioning and rotating in edit mode
                // up arrow
                context.lineWidth = 2;
                context.strokeStyle = "#00ff00";
                context.beginPath();
                
                context.moveTo(0, 0);
                context.lineTo(0, -50);
                context.moveTo(0, -52);
                context.lineTo(-6, -40);
                context.moveTo(0, -52);
                context.lineTo(6, -40);

                context.stroke();
                // right arrow
                context.strokeStyle = "#0000ff";
                context.beginPath();
                
                context.moveTo(0, 0);
                context.lineTo(50, 0);
                context.moveTo(52, 0);
                context.lineTo(40, 6);
                context.moveTo(52, 0);
                context.lineTo(40, -6);

                context.stroke();

                context.restore();
        }
}