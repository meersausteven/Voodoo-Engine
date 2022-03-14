
class Camera extends Component {
        type = "Camera";

        constructor (canvas, x, y) {
                this.canvas = canvas;

                this.pos = new Vector2(
                        x - canvas.width / 2,
                        y - canvas.height / 2
                );
        }

        lateUpdate() {
                return;
        }
}
