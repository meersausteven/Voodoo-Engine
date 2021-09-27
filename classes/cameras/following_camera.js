
class FollowingCamera extends Camera {
        constructor(canvas, follow, x = 0, y = 0) {
                // follow: a gameobject
                // x: position on the x axis
                // y: position on the y axis
                super(canvas, x, y);

                this.type = "Following Camera";
                this.follow = follow;

                this.pos.x = this.follow.pos.x - (this.canvas.width / 2);
                this.pos.y = this.follow.pos.y - (this.canvas.height / 2);
        }

        lateUpdate() {
                // position camera that the center of the object is in the center of the canvas
                this.pos.x = this.follow.pos.x - (this.follow.width / 2) - (this.canvas.width / 2);
                this.pos.y = this.follow.pos.y - this.follow.height - (this.canvas.height / 2);
        }
}