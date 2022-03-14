
class GroundObject extends GameObject {
        type = "Ground Object";
        name = "new GroundObject";

        constructor(game, x, y, imageSource, width = 64, height = 64, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.imageSource = imageSource;
                this.renderer = new ImageRenderer(this, "tiles/" + this.imageSource);
        }
}
