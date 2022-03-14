
class Player extends GameObject {
        constructor(game, x, y, width = 48, height = 66, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = 'Player';
                this.collider.push(new CircleCollider(this, this.game.activeCamera, this.width / 3.2, false, 0, -this.height / 3.5));
                this.rigidbody = new Rigidbody(this);
                this.renderer = new ImageRenderer(this, this.image);
                this.animation = new Animation(this.renderer, "player/walk/down", 1, 100);
                this.camera = new FollowingCamera(this.game.canvas, this);
                
                // movement
                this.moveSpeed = 3;
                this.moving = false;
                this.facing = 'down';
        }

        update() {
                // get values from 8 directional movement function
                let movement = simple8DirMovement(this);
                
                // if this has a rigidbody, check for collisions
                if (this.rigidbody != null) {
                        let i = 0;                             // looping through all gameobjects in the current game
                        let go = this.game.gameObjects.length;  // game.gameobjects length
                        let wouldCollideX, wouldCollideY = false;

                        while (i < go) {
                                // loop through other game objects

                                if (wouldCollideX && wouldCollideY) {
                                        break;
                                }

                                let gameObject = this.game.gameObjects[i];
                                
                                if ((gameObject != this) && (gameObject.collider.length > 0)) {

                                        let t = 0;                      // looping through this.collider
                                        let tc = this.collider.length;  // this.collider length

                                        while (t < tc) {
                                                //loop through all colliders of each other game object

                                                let j = 0;                           // looping through gameObject.collider
                                                let gc = gameObject.collider.length;  // gameObject.collider length

                                                while (j < gc) {
                                                        let nextPos;

                                                        // x direction
                                                        if (gameObject.collider[j].isTrigger == false) {
                                                                if (wouldCollideX != true) {
                                                                        nextPos = {
                                                                                x: this.pos.x + (movement.direction.x * this.moveSpeed),
                                                                                y: this.pos.y
                                                                        };
                                                                        
                                                                        if (this.collider[t].checkColliderOverlapping(gameObject.collider[j], nextPos)) {
                                                                                wouldCollideX = true;
                                                                        }
                                                                }

                                                                // y direction
                                                                if (wouldCollideY != true) {
                                                                        nextPos = {
                                                                                x: this.pos.x,
                                                                                y: this.pos.y + (movement.direction.y * this.moveSpeed)
                                                                        };
                                                                        
                                                                        if (this.collider[t].checkColliderOverlapping(gameObject.collider[j], nextPos)) {
                                                                                wouldCollideY = true;
                                                                        }
                                                                }
                                                        }

                                                        // if the other collider is a trigger, call a function if the player is inside it
                                                        if (gameObject.collider[j].isTrigger == true) {
                                                                //console.log(gameObject.collider[j].insideTrigger);
                                                                if (gameObject.collider[j].insideTrigger.filter(el => el.name == this.name).length > 0) {
                                                                        // player left the trigger
                                                                        if (!this.collider[t].checkColliderOverlapping(gameObject.collider[j]) ) {
                                                                                gameObject.collider[j].insideTrigger = gameObject.collider[j].insideTrigger.filter(el => el.name !== this.name);
                                                                                gameObject.onAction(this, "triggerLeave");
                                                                        }
                                                                } else {
                                                                        // player entered the trigger
                                                                        if (this.collider[t].checkColliderOverlapping(gameObject.collider[j]) ) {
                                                                                gameObject.collider[j].insideTrigger.push(this);
                                                                                gameObject.onAction(this, "triggerEnter");
                                                                        }
                                                                }
                                                        }
                                                        ++j;
                                                }
                                                
                                                ++t;
                                        }
                                }

                                ++i;
                        }
                        // move the player in the directions where no collision will occour
                        if (!wouldCollideX) {
                                this.pos.x += movement.direction.x * this.moveSpeed;
                        }

                        if (!wouldCollideY) {
                                this.pos.y += movement.direction.y * this.moveSpeed;
                        }
                }

                // change animation if this.moving changed or this.facing changed
                if ( (movement.moving != this.moving) || (movement.facing != this.facing) ) {
                        this.moving = movement.moving;
                        this.facing = movement.facing;

                        if (this.moving == true) {
                                this.animation = new Animation(this.renderer, "player/walk/" + this.facing, 4, 100);
                        } else {
                                this.animation = new Animation(this.renderer, "player/walk/" + this.facing);
                        }
                }
                
                super.update();
        }
}