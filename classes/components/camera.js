
class Camera extends Component {
        type = 'Camera';

        canvas;
        cavnasContext;
        currentFrame;

        constructor() {
                super();

                this.canvas = document.createElement('canvas');
        }

        start() {
                this.canvas.width = this.gameObject.scene.project.settings.canvasWidth;
                this.canvas.height = this.gameObject.scene.project.settings.canvasHeight;
                this.canvasContext = this.canvas.getContext("2d");
        }

        update() {
                // clear canvas
                this.canvasContext.clearRect(0, 0, this.gameObject.scene.project.canvas.width, this.gameObject.scene.project.canvas.height);

                let i = 0;
                let gol = this.gameObject.scene.gameObjects.length;
                // go through all sibling gameObjects
                while (i < gol) {
                        let go = this.gameObject.scene.gameObjects[i];

                        if (go.attributes['enabled'].value === true) {
                                let j = 0;
                                let cl = go.components.length;
                                // process all components
                                while (j < cl) {
                                        let c = go.components[j];

                                        if (c.attributes['enabled'].value === true) {
                                                c.render(this);
                                        }

                                        ++j;
                                }
                        }

                        ++i;
                }

                this.currentFrame = this.canvas;
        }
}