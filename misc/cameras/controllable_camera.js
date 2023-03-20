
class ControllableCamera extends Camera {
        type = "Camera/Controllable Camera";

        constructor(canvas, moveSpeed, x = 0, y = 0) {
                // x: position on the x axis
                // y: position on the y axis
                // moveSpeed: base speed at which the camera moves on input

                super(canvas, x, y);

                this.moveSpeed = moveSpeed;
        }

        lateUpdate() {
                let speed = this.moveSpeed * time.delta;

                simple8DirMovement(this, speed);
        }
}
