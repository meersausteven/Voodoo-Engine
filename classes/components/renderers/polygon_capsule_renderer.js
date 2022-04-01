
class PolygonCapsuleRenderer extends PolygonRenderer {
        type = "Renderer/Polygon Capsule Renderer";
        polygonCapsule;
        color;
        borderWidth;
        borderColor;
        
        constructor(polygonCapsule, color, borderWidth, borderColor, offset = new Vector2()) {
                super(polygonCapsule.points, color, borderWidth, borderColor, offset);

                this.polygonCapsule = polygonCapsule;
                this.color = color;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;
        }

        update() {
                super.update();
        }
}
