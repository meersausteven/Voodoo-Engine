
class PolygonCircleRenderer extends PolygonRenderer {
        type = "Renderer/Polygon Circle Renderer";
        polygonCircle;
        color;
        borderWidth;
        borderColor;
        
        constructor(polygonCircle, color, borderWidth, borderColor, offset = new Vector2()) {
                super(polygonCircle.points, color, borderWidth, borderColor, offset);
                
                this.polygonCircle = polygonCircle;
                this.color = color;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;
        }

        update() {
                super.update();
        }
}