
class Rigidbody extends Component {
        type = "Rigidbody";
        // gravity 
        obeyGravity = true;
        gravityScale = 1;
        mass = 1;
        // velocity
        velocity = new Vector2();
        friction = 0.025;
        // collision
        canCollide = true;

        update() {
                // velocity stuff
                this.gameObject.pos.x += this.velocity.x * time.deltaTime;
                this.gameObject.pos.y += this.velocity.y * time.deltaTime;

                this.velocity.x *= (1 - this.friction);
                this.velocity.y *= (1 - this.friction);

                if ( (this.velocity.x < 0.01) && (this.velocity.x > -0.01) ) {
                        this.velocity.x = 0;
                }

                if ( (this.velocity.y < 0.01) && (this.velocity.y > -0.01) ) {
                        this.velocity.y = 0;
                }
        }

        addForce(force) {
                this.velocity.add(force);
        }
}
