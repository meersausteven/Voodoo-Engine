
class Camera extends Component {
        type = 'Camera';

        canvas;
        cavnasContext;
        frameImage;

        constructor(width, height) {
                super();

                this.attributes['viewWidth'] = new AttributeNumber('view width', width);
                this.attributes['viewHeight'] = new AttributeNumber('view height', height);

                this.canvas = document.createElement('canvas');
                this.canvas.width = this.attributes['viewWidth'].value;
                this.canvas.height = this.attributes['viewHeight'].value;
                this.canvasContext = this.canvas.getContext("2d");
        }

        update() {
                // clear canvas
                this.canvasContext.clearRect(0, 0, this.attributes['viewWidth'].value, this.attributes['viewHeight'].value);

                this.gameObject.scene.project.renderer.renderToCameraView(this);

                this.frameImage = this.canvas;
        }
}