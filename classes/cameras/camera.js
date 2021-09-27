
class Camera {
        constructor (canvas, x, y) {
                this.type = "Camera";

                this.canvas = canvas;

                this.pos = {
                        x: x - canvas.width / 2,
                        y: y - canvas.height / 2
                };
        }

        lateUpdate() {
                return;
        }
}
