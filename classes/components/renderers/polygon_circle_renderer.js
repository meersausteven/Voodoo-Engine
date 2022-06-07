
class PolygonCircleRenderer extends PolygonRenderer {
        type = "Polygon Circle Renderer";
        
        constructor(polygonCircle = new PolygonCircle(40, 12), fillColor = '#ff0000', borderWidth = 2, borderColor = '#ffffff', offset = new Vector2()) {
                // PolygonCircle polygonCircle: polygon circle
                // color fillColor: fill color
                // int borderWidth: width of border
                // color borderColor: color of border

                super(polygonCircle.points, fillColor, borderWidth, borderColor, offset);
                
                this.attributes['polygonCircle'] = polygonCircle;
                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth);
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
        }

        render(camera) {
                super.render(camera);
        }
}