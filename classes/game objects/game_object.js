
class GameObject {
        constructor(game, x, y, width, height, rotationAngle) {
                this.type = 'Game Object';
                this.name = 'new GameObject';

                // game this object belongs to
                this.game = game;
                
                // positioning
                this.pos = {
                        x: x,
                        y: y
                };
                this.width = width;
                this.height = height;
                this.rotationAngle = rotationAngle;

                // camera 
                this.camera = null;

                // collider
                this.collider = [];

                // rigidbody
                this.rigidbody = null;

                // renderer
                this.renderer = null;
                this.image = null;
                this.animation = null;
        }

        update() {
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
        }

        lateUpdate() {
                if (this.camera != null) {
                        this.camera.lateUpdate();
                }
        }

        onAction(actor, actionType) {
                return;
        }
        
        showBounds(context, camera) {
                context.save();
                // position
                context.translate(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y);
                context.rotate(this.rotationAngle);
                // true position
                context.lineWidth = 3;
                context.strokeStyle = '#336633';
                context.strokeRect(-2, -2, 4, 4);
                // draw width and height
                context.lineWidth = 1;
                context.strokeStyle = '#224422';
                context.strokeRect(-this.width / 2, -this.height, this.width, this.height);

                context.restore();
        }
}