
class Rigidbody {
        constructor(parent) {
                // parent: a gameObject (needs a collider)
                this.parent = parent;

                this.obeyGravity = false;
                this.gravityScale = 1;
                this.mass = 1;

                this.obeyColliders = true;

                this.velocity = {
                        x: 0,
                        y: 0
                };
                this.friction = 0.025;
        }

        update() {
                // velocity stuff
                this.parent.pos.x += this.velocity.x * time.deltaTime;
                this.parent.pos.y += this.velocity.y * time.deltaTime;

                this.velocity.x *= (1 - this.friction);
                this.velocity.y *= (1 - this.friction);

                if ( (this.velocity.x < 0.01) && (this.velocity.x > -0.01) ) {
                        this.velocity.x = 0;
                }

                if ( (this.velocity.y < 0.01) && (this.velocity.y > -0.01) ) {
                        this.velocity.y = 0;
                }
        }
}
