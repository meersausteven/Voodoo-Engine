
class GroundObject extends GameObject {
        constructor(game, x, y, imageSource, width = 64, height = 64, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.type = "Ground Object";
                this.name = "new GroundObject";

                this.imageSource = imageSource;
                this.renderer = new ImageRenderer(this, "tiles/" + this.imageSource);
        }
}
